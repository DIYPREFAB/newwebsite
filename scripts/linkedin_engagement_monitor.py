#!/usr/bin/env python3
"""
LinkedIn Engagement Monitor with AUTO-RESPONSE
Tracks comments, sends notifications, and auto-responds to common queries
Part of the Engagement Protocol (2-hour response time)
"""

import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
import smtplib
import re
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from pathlib import Path

# Import notification utility
sys.path.insert(0, str(Path(__file__).parent))

# ============================================================
# PRE-EXECUTION SYNCHRONIZATION CHECK
# ============================================================
def run_sync_validation():
    """Run workspace synchronization before execution."""
    try:
        from workspace_synchronizer import WorkspaceSynchronizer
        sync = WorkspaceSynchronizer()
        
        # Quick validation
        sync.check_script_dependencies()
        sync.check_environment_consistency()
        
        critical = [i for i in sync.issues if i.severity == "CRITICAL"]
        
        if critical:
            print(f"🛑 ENGAGEMENT MONITOR BLOCKED: {len(critical)} critical issues")
            for issue in critical:
                print(f"  ❌ [{issue.file_type}] {issue.issue}")
            sys.exit(1)
            
    except Exception as e:
        # Continue on sync error (engagement is less critical)
        pass

run_sync_validation()
# ============================================================

from notification_utils import notify_success, notify_failure, notify_warning
from ist_utils import get_ist_time, get_ist_timestamp_with_tz

# Load from .env
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, val = line.strip().split('=', 1)
                os.environ.setdefault(key, val)

ACCESS_TOKEN = os.environ.get("LINKEDIN_ACCESS_TOKEN", "")
COMPANY_ID = os.environ.get("LINKEDIN_COMPANY_ID", "urn:li:organization:112982450")

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "info@diyprefab.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
FROM_EMAIL = "ceo@diyprefab.com"
TO_EMAIL = os.environ.get("TO_EMAIL", "garvitagrawal08@gmail.com")

# AUTO-RESPONSE TEMPLATES
RESPONSE_TEMPLATES = {
    "pricing": {
        "keywords": ["price", "pricing", "cost", "how much", "quote", "estimate", "budget", "rate", "expensive", "cheap"],
        "response": "Thanks for your interest! Every project has unique requirements. We'd be happy to provide a customized quote based on your specific needs. Please DM us or book a consultation at https://cal.com/diyprefab/30min 🏗️"
    },
    "services": {
        "keywords": ["service", "what do you do", "offer", "provide", "solution", "help with", "can you", "do you"],
        "response": "We specialize in AI-powered structural steel design for PEB buildings, warehouses, and industrial structures. From concept to fabrication drawings - we optimize for cost, speed, and code compliance. Check our featured section for case studies! 🏭"
    },
    "contact": {
        "keywords": ["contact", "email", "phone", "reach", "call", "message", "dm", "connect"],
        "response": "You can reach us at info@diyprefab.com or book a 30-min consultation directly at https://cal.com/diyprefab/30min. We typically respond within 24 hours. Looking forward to connecting! 📧"
    },
    "location": {
        "keywords": ["where", "location", "based", "office", "city", "india", "bangalore", "chennai", "delhi", "mumbai"],
        "response": "We're headquartered in India and serve clients nationwide! Our AI-powered platform allows us to deliver projects efficiently regardless of location. We have experience with projects across major Indian cities. 🇮🇳"
    },
    "ai_technology": {
        "keywords": ["ai", "automation", "software", "technology", "how does it work", "platform", "tool", "system"],
        "response": "Our AI analyzes thousands of design iterations to optimize steel tonnage while meeting all code requirements (IS 800, IS 875, etc.). The result? 15-30% steel savings and 70% faster delivery. Human engineers validate everything! 🤖"
    },
    "appreciation": {
        "keywords": ["great", "awesome", "excellent", "amazing", "good", "love", "nice", "well done", "thank", "thanks"],
        "response": "Thank you for the kind words! 🙏 We love sharing insights from the field. Follow us for weekly Truth Tuesday, Winning Wednesday, Technical Thursday, and Feedback Friday content!"
    },
    "case_study_challenges": {
        "keywords": ["challenges", "challenge", "difficult", "difficulty", "problem", "issues", "issue", "what went wrong", "what was hard", "obstacles", "hurdles", "lessons learned", "what did you face", "how did you handle"],
        "response": "Great question! The real challenges were less about the calculations — those were straightforward — and more about coordination:\n\n1. Client scope changes mid-design (bay spacing, crane specs) meant recalculating load distributions repeatedly\n2. Foundation interface — our PEB column reactions didn't always match the civil drawings, requiring pedestal redesign\n\nThe AI handled the recalculation cycles in minutes instead of days, but the gap between structural and civil coordination remains the real bottleneck. That's where experience still beats automation.\n\nHappy to walk you through the full case study — DM us or book a call at https://cal.com/diyprefab/30min"
    },
    "question": {
        "keywords": ["?", "question", "wondering", "curious", "explain", "clarify", "what is", "how to"],
        "response": "Great question! 💡 We'll prepare a detailed response. For immediate assistance, feel free to DM us or book a consultation at https://cal.com/diyprefab/30min. Our engineers love technical discussions!"
    }
}

# DYNAMIC MENTION RESPONSES - Based on comment intent
MENTION_RESPONSES = {
    "pricing": "Thanks for the mention! 💰 Every project has unique requirements. We'd be happy to provide a customized quote - DM us or book at https://cal.com/diyprefab/30min",
    "services": "Thanks for thinking of us! 🏭 We specialize in AI-powered structural steel design for PEB buildings and warehouses. From concept to fabrication drawings with 15-30% steel savings.",
    "contact": "Thanks for the mention! 📧 Reach us at info@diyprefab.com or book directly at https://cal.com/diyprefab/30min. We typically respond within 24 hours!",
    "location": "Thanks for mentioning us! 🇮🇳 We're India-based and serve clients nationwide. Our AI platform delivers efficiently regardless of location.",
    "ai_technology": "Thanks for the mention! 🤖 Our AI analyzes thousands of design iterations to optimize steel tonnage while meeting IS 800/875 codes. Human engineers validate everything!",
    "appreciation": "Thank you for the kind mention! 🙏 We love sharing insights from the field. Follow us for weekly Truth Tuesday, Winning Wednesday, Technical Thursday content!",
    "question": "Thanks for the mention! 💡 Great question - we'll prepare a detailed response. For immediate help, DM us or book at https://cal.com/diyprefab/30min",
    "recommendation": "Thanks for recommending us! 🙏 We appreciate the trust. Anyone interested can DM us or book at https://cal.com/diyprefab/30min for a free consultation.",
    "comparison": "Thanks for the mention! ⚖️ We focus on AI-optimized steel design that reduces tonnage by 15-30% while maintaining code compliance. Happy to discuss how we compare - DM us!",
    "collaboration": "Thanks for the mention! 🤝 We'd love to explore collaboration opportunities. Please DM us or email info@diyprefab.com to discuss further.",
    "default": "Thanks for the mention! 🙏 We appreciate you thinking of us. If you have any questions about steel construction, PEB, or structural engineering, feel free to ask or DM us!"
}

def get_logo_path():
    """Get path to DIYPREFAB logo."""
    logo_path = Path(__file__).parent.parent / "memory" / "diyprefab_logo_email.jpeg"
    if logo_path.exists():
        return logo_path
    logo_path = Path(__file__).parent.parent / "memory" / "diyprefab_logo.jpeg"
    if logo_path.exists():
        return logo_path
    return None

def get_recent_posts():
    """Fetch recent posts from company page."""
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    encoded_company = urllib.parse.quote(COMPANY_ID, safe='')
    url = f"https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List({encoded_company})&sortBy=LAST_MODIFIED&count=10"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error fetching posts: {e.code}")
        try:
            error_body = e.read().decode()
            print(f"Error details: {error_body}")
        except:
            pass
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def get_post_comments(post_urn):
    """Fetch comments on a specific post."""
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    encoded_urn = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_urn}/comments"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {"elements": []}
        print(f"Error fetching comments: {e.code}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def get_post_reactions(post_urn):
    """Fetch reactions (likes, etc.) on a specific post."""
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    encoded_urn = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/reactions?entity={encoded_urn}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {"elements": []}
        print(f"Error fetching reactions: {e.code}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None


def get_post_likes_count(post_urn):
    """Get total likes count for a post using socialActions API."""
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    encoded_urn = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_urn}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            return data.get('likesSummary', {}).get('totalLikes', 0)
    except urllib.error.HTTPError as e:
        return 0
    except Exception as e:
        return 0


def check_network_feed_for_mentions():
    """
    Check the user's network feed for posts mentioning DIYPREFAB.
    This looks at posts in the network that might mention the company.
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    mentions = []
    
    try:
        # Get network feed (posts from connections)
        url = "https://api.linkedin.com/v2/ugcPosts?q=authors&count=50"
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            
            for post in data.get('elements', []):
                post_text = post.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {}).get('shareCommentary', {}).get('text', '').lower()
                author = post.get('author', '')
                
                # Skip own posts
                if author == COMPANY_ID:
                    continue
                
                # Check for mentions
                if any(keyword in post_text for keyword in ['diyprefab', 'diy prefab', '@diyprefab']):
                    mentions.append({
                        'type': 'post',
                        'urn': post.get('id'),
                        'text': post.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {}).get('shareCommentary', {}).get('text', ''),
                        'author': author,
                        'timestamp': post.get('created', {}).get('time', 0)
                    })
                else:
                    # Check comments on this post for mentions
                    comment_mentions = check_comments_for_mentions(post.get('id'), author)
                    mentions.extend(comment_mentions)
    
    except Exception as e:
        print(f"  Network feed check error: {e}")
    
    return mentions


def search_diyprefab_mentions():
    """
    Search for posts/comments mentioning DIYPREFAB.
    Uses LinkedIn's content search to find mentions.
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    mentions = []
    
    # Try to get recent content that mentions DIYPREFAB
    # This searches for posts containing "DIYPREFAB"
    search_keywords = ["DIYPREFAB", "DIY PREFAB", "diy prefab"]
    
    for keyword in search_keywords:
        try:
            # Use the content search API (limited availability)
            # Search for posts in the last 7 days
            url = f"https://api.linkedin.com/v2/posts?q=author&count=50"
            
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as response:
                data = json.loads(response.read().decode())
                
                for post in data.get('elements', []):
                    post_text = post.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {}).get('shareCommentary', {}).get('text', '').lower()
                    
                    if keyword.lower() in post_text:
                        # Check if it's not from our own company
                        author = post.get('author', '')
                        if author != COMPANY_ID:
                            mentions.append({
                                'type': 'post',
                                'urn': post.get('id'),
                                'text': post.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {}).get('shareCommentary', {}).get('text', ''),
                                'author': author,
                                'timestamp': post.get('created', {}).get('time', 0)
                            })
        except Exception as e:
            print(f"  Search error for '{keyword}': {e}")
            continue
    
    return mentions


def check_comments_for_mentions(post_urn, post_author):
    """
    Check comments on a post for mentions of DIYPREFAB.
    Used for posts not authored by DIYPREFAB.
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    encoded_urn = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_urn}/comments"
    
    mentions = []
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode())
            
            for comment in data.get('elements', []):
                comment_text = comment.get('message', {}).get('text', '').lower()
                
                # Check if DIYPREFAB is mentioned
                if any(keyword in comment_text for keyword in ['diyprefab', 'diy prefab', '@diyprefab']):
                    mentions.append({
                        'type': 'comment',
                        'urn': comment.get('id'),
                        'text': comment.get('message', {}).get('text', ''),
                        'author': comment.get('actor', ''),
                        'post_urn': post_urn,
                        'post_author': post_author,
                        'timestamp': comment.get('created', {}).get('time', 0)
                    })
    except Exception as e:
        print(f"  Error checking comments: {e}")
    
    return mentions


def analyze_mention_intent(text):
    """
    Analyze a mention to determine the intent/context.
    Returns the appropriate response category.
    """
    text_lower = text.lower()
    
    # Check for recommendation context ("check out", "recommend", etc.)
    if any(word in text_lower for word in ['recommend', 'check out', 'try', 'use', 'contact', 'reach out to']):
        return "recommendation"
    
    # Check for collaboration/partnership
    if any(word in text_lower for word in ['partner', 'collaborate', 'work together', 'join', 'team up']):
        return "collaboration"
    
    # Check for comparison
    if any(word in text_lower for word in ['vs', 'versus', 'compare', 'better than', 'difference', 'alternative']):
        return "comparison"
    
    # Check for pricing
    if any(word in text_lower for word in ['price', 'pricing', 'cost', 'how much', 'quote', 'budget', 'rate', 'expensive', 'cheap', 'affordable']):
        return "pricing"
    
    # Check for services/what we do
    if any(word in text_lower for word in ['what do they do', 'what do you do', 'services', 'offer', 'provide', 'solution', 'help with']):
        return "services"
    
    # Check for contact
    if any(word in text_lower for word in ['contact', 'email', 'phone', 'reach', 'call', 'message', 'dm']):
        return "contact"
    
    # Check for location
    if any(word in text_lower for word in ['where', 'location', 'based', 'city', 'india', 'bangalore', 'chennai', 'delhi']):
        return "location"
    
    # Check for AI/technology
    if any(word in text_lower for word in ['ai', 'automation', 'software', 'technology', 'how does it work', 'platform']):
        return "ai_technology"
    
    # Check for appreciation
    if any(word in text_lower for word in ['great', 'awesome', 'excellent', 'amazing', 'good', 'love', 'nice', 'well done', 'thank']):
        return "appreciation"
    
    # Check for question
    if any(word in text_lower for word in ['?', 'question', 'wondering', 'curious', 'explain', 'how to', 'what is', 'can they', 'will they']):
        return "question"
    
    # Default
    return "default"


def respond_to_mention(mention, tracker):
    """
    Respond to a mention on someone else's post with DYNAMIC context-aware response.
    Analyzes the mention text to determine appropriate response type.
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    # Analyze the mention text to determine intent
    mention_text = mention.get('text', '')
    intent_category = analyze_mention_intent(mention_text)
    
    # Get the appropriate response based on intent
    response_text = MENTION_RESPONSES.get(intent_category, MENTION_RESPONSES["default"])
    
    print(f"    Detected intent: {intent_category}")
    print(f"    Response: {response_text[:60]}...")
    
    # Create comment on the post
    comment_body = {
        "actor": COMPANY_ID,
        "message": {
            "text": response_text
        }
    }
    
    post_urn = mention.get('post_urn', mention.get('urn'))
    encoded_post = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_post}/comments"
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(comment_body).encode(),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            print(f"    ✓ Mention response posted!")
            
            # Track this response
            mention_id = mention.get('urn')
            if mention_id not in tracker.get('mention_responses', []):
                tracker.setdefault('mention_responses', []).append(mention_id)
            
            return result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"    ✗ Mention response failed: HTTP {e.code}")
        print(f"      {error_body[:200]}")
        return None
    except Exception as e:
        print(f"    ✗ Mention response failed: {e}")
        return None


def reply_to_comment(post_urn, comment_id, comment_text, parent_comment_urn=None):
    """Reply to a specific comment as a threaded reply (nested under the comment).
    
    CRITICAL: LinkedIn threaded replies require:
    - POST to /socialActions/{postUrn}/comments (NOT /socialActions/{commentUrn}/comments)
    - Include "parentComment": full_comment_urn in the request body
    - The full comment URN must use urn:li:activity:... (NOT urn:li:share:...)
    
    Args:
        post_urn: The post URN (e.g., urn:li:share:123 or urn:li:ugcPost:123)
        comment_id: Raw numeric comment ID (for tracking)
        comment_text: The reply text
        parent_comment_urn: Full comment URN from API $URN field (e.g., urn:li:comment:(urn:li:activity:...,id))
    """
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    if not parent_comment_urn:
        print(f"    ✗ Cannot post threaded reply: missing parent_comment_urn")
        return None
    
    encoded_post = urllib.parse.quote(post_urn, safe='')
    url = f"https://api.linkedin.com/v2/socialActions/{encoded_post}/comments"
    
    reply_body = {
        "actor": COMPANY_ID,
        "message": {
            "text": comment_text
        },
        "parentComment": parent_comment_urn
    }
    
    print(f"    📤 POST {url[:120]}...")
    print(f"    📎 parentComment: {parent_comment_urn[:80]}...")
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(reply_body).encode(),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            
            # Verify it's actually a threaded reply
            if result.get('parentComment') == parent_comment_urn:
                print(f"    ✓ CONFIRMED: Threaded reply posted (parentComment set correctly)")
                return result
            else:
                # API returned 201 but parentComment is missing/wrong - it's a top-level comment
                reply_id = result.get('id', 'unknown')
                print(f"    ⚠️ WARNING: API returned 201 but reply is NOT threaded!")
                print(f"       Expected parentComment: {parent_comment_urn}")
                print(f"       Actual reply ID: {reply_id}")
                print(f"       This is a top-level comment, not a threaded reply.")
                # Return None to indicate failure so caller can retry or alert
                return None
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"    ✗ Reply failed: HTTP {e.code}")
        print(f"      Error body: {error_body[:500]}")
        return None
    except Exception as e:
        print(f"    ✗ Reply failed: {e}")
        return None

def analyze_comment(comment_text):
    """Analyze comment text and determine appropriate response category."""
    comment_lower = comment_text.lower()
    
    scores = {}
    for category, data in RESPONSE_TEMPLATES.items():
        score = 0
        for keyword in data["keywords"]:
            if keyword in comment_lower:
                score += 1
        if score > 0:
            scores[category] = score
    
    if scores:
        # Return category with highest score
        return max(scores, key=scores.get)
    
    # Default: generic appreciation
    return "appreciation"

# AUTO-RESPONSE SETTINGS
MIN_MINUTES_BETWEEN_RESPONSES = 30  # Space out responses


def should_auto_respond(comment_text, commenter, commenter_urn, post_urn, tracker):
    """Determine if we should auto-respond to this comment."""
    comment_lower = comment_text.lower()

    # CRITICAL: Skip if commenter is our own company
    if commenter_urn == COMPANY_ID:
        print(f"    ⏩ Skipping: Comment from our own company")
        return False, None

    # Don't respond to very short comments
    if len(comment_text) < 10:
        return False, None

    # Don't respond if it's a reply to another comment (starts with @)
    if comment_text.startswith("@"):
        return False, None

    # Check cooldown period (per post)
    post_key = post_urn.replace(':', '_')
    last_response_time = tracker.get('last_response_time', {}).get(post_key)
    if last_response_time:
        last_time = datetime.fromisoformat(last_response_time)
        minutes_since = (datetime.now() - last_time).total_seconds() / 60
        if minutes_since < MIN_MINUTES_BETWEEN_RESPONSES:
            print(f"    ⏱️ Cooldown: {MIN_MINUTES_BETWEEN_RESPONSES - minutes_since:.0f}min remaining")
            return False, None

    # Analyze and get response
    category = analyze_comment(comment_text)
    response = RESPONSE_TEMPLATES[category]["response"]

    return True, response

def send_engagement_email(post_text, comment_count, comments, auto_responded_count=0, reactions_count=0, likes_count=0):
    """Send email notification about new comments and reactions with CID logo."""
    
    comments_html = ""
    for i, comment in enumerate(comments[:5], 1):
        comment_text = comment.get('message', {}).get('text', 'No text')
        commenter = comment.get('actor', 'Unknown')
        auto_reply_status = ""
        if comment.get('auto_replied'):
            auto_reply_status = " <span style='color: #4caf50; font-size: 11px;'>(Auto-replied ✓)</span>"
        comments_html += f"<tr><td style='padding: 10px; border-bottom: 1px solid #eee;'><strong>{i}.</strong> <span style='color: #0077b5;'>{commenter}</span>: {comment_text[:100]}...{auto_reply_status}</td></tr>"
    
    # Add reactions summary
    reactions_html = ""
    if reactions_count > 0 or likes_count > 0:
        reactions_html = f"""
        <div style="background: #e3f2fd; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">👍 Engagement Summary</h4>
            <p style="margin: 0;">
                <strong>Total Likes:</strong> {likes_count}<br>
                <strong>New Reactions:</strong> {reactions_count}
            </p>
        </div>
        """
    
    msg_root = MIMEMultipart('related')
    msg_root['Subject'] = f'🔔 LinkedIn: {comment_count} Comments, {likes_count} Likes ({auto_responded_count} Auto-Responded)'
    msg_root['From'] = FROM_EMAIL
    msg_root['To'] = TO_EMAIL
    
    msg_alternative = MIMEMultipart('alternative')
    msg_root.attach(msg_alternative)
    
    msg_text = f"""
LinkedIn Engagement Alert - Action Required

A recent post has received engagement.

Post Preview:
"{post_text[:150]}..."

Engagement Summary:
- Comments: {comment_count}
- Auto-Responded: {auto_responded_count}
- Total Likes: {likes_count}
- New Reactions: {reactions_count}

Comments:
"""
    
    for i, comment in enumerate(comments[:5], 1):
        comment_text = comment.get('message', {}).get('text', 'No text')
        commenter = comment.get('actor', 'Unknown')
        auto_status = " (Auto-replied)" if comment.get('auto_replied') else ""
        msg_text += f"\n{i}. {commenter}: {comment_text[:100]}...{auto_status}"
    
    if auto_responded_count < comment_count:
        msg_text += """

⚠️ ACTION REQUIRED:
Some comments need manual response within 2 hours.

Quick Reply Link:
https://www.linkedin.com/company/diyprefab/posts/
"""
    
    for i, comment in enumerate(comments[:5], 1):
        comment_text = comment.get('message', {}).get('text', 'No text')
        commenter = comment.get('actor', 'Unknown')
        auto_status = " (Auto-replied)" if comment.get('auto_replied') else ""
        msg_text += f"\n{i}. {commenter}: {comment_text[:100]}...{auto_status}"
    
    if auto_responded_count < comment_count:
        msg_text += """

⚠️ ACTION REQUIRED:
Some comments need manual response within 2 hours.

Quick Reply Link:
https://www.linkedin.com/company/diyprefab/posts/
"""
    
    msg_text += f"""

---
DIYPREFAB
Timestamp: {get_ist_timestamp_with_tz()}
"""
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border-left: 4px solid #ff9800;">
            <h2 style="color: #1a3d3d;">🔔 LinkedIn Engagement Alert</h2>
            <div style="background: #fff3e0; padding: 15px; border-radius: 4px;">
                <p style="margin: 0;">
                    <strong>{comment_count} new comments</strong> | <strong style="color: #4caf50;">{auto_responded_count} auto-responded</strong>
                </p>
                <p style="margin: 5px 0 0 0;">
                    <strong>👍 {likes_count} total likes</strong> | <strong>{reactions_count} new reactions</strong>
                </p>
            </div>
            
            <h3 style="color: #1a3d3d; margin-top: 25px;">Post Preview:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-style: italic; color: #555;">
                "{post_text[:150]}..."
            </div>
            
            <h3 style="color: #1a3d3d;">Comments:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                {comments_html}
            </table>
            
            {f"<div style='margin-top: 25px; padding: 20px; background: #ffebee; border-radius: 4px;'><h4 style='margin-top: 0; color: #c62828;'>⚠️ Action Required</h4><p>Some comments need manual response within 2 hours.</p><p><a href='https://www.linkedin.com/company/diyprefab/posts/' style='color: #0077b5; font-weight: bold;'>→ Open LinkedIn</a></p></div>" if auto_responded_count < comment_count else ""}
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <img src="cid:diyprefab_logo" alt="DIYPREFAB" style="width: 150px; height: auto; display: block;">
            <p style="color: #666; font-size: 12px; margin-top: 10px;">
                DIYPREFAB<br>
                Timestamp: {get_ist_timestamp_with_tz()}
            </p>
        </div>
    </body>
    </html>
    """
    
    msg_alternative.attach(MIMEText(msg_text, 'plain'))
    msg_alternative.attach(MIMEText(html_body, 'html'))
    
    logo_path = get_logo_path()
    if logo_path:
        with open(logo_path, 'rb') as f:
            img = MIMEImage(f.read())
            img.add_header('Content-ID', '<diyprefab_logo>')
            img.add_header('Content-Disposition', 'inline', filename='diyprefab_logo.jpeg')
            msg_root.attach(img)
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, TO_EMAIL, msg_root.as_string())
        print(f"✓ Engagement email sent ({comment_count} comments, {auto_responded_count} auto-responded)")
        return True
    except Exception as e:
        print(f"✗ Failed to send email: {e}")
        return False

def check_engagement():
    """Main function to check for new comments and auto-respond."""
    print("=" * 70)
    print("LinkedIn Engagement Monitor with AUTO-RESPONSE")
    print("=" * 70)
    print(f"Timestamp: {get_ist_timestamp_with_tz()}")
    print()
    
    if not ACCESS_TOKEN:
        error_msg = "No LinkedIn access token found"
        print(f"Error: {error_msg}")
        notify_failure(
            "LinkedIn Engagement Monitor",
            Exception(error_msg),
            additional_info="Please check that LINKEDIN_ACCESS_TOKEN is set in .env"
        )
        return 1
    
    try:
        # Load tracker
        tracker_path = Path(__file__).parent.parent / "memory" / "engagement_tracker.json"
        tracker = {"checked_comments": {}, "auto_responded": [], "last_response_time": {}}
        if tracker_path.exists():
            with open(tracker_path) as f:
                tracker = json.load(f)
        
        # CLEANUP: Remove stuck comments from checked_comments that are in failed_replies
        # This fixes the bug where old code added failed comments to checked_comments permanently
        failed_replies = tracker.get('failed_replies', {})
        checked_comments = tracker.get('checked_comments', {})
        cleanup_count = 0
        for post_key, comment_list in checked_comments.items():
            cleaned = []
            for cid in comment_list:
                if cid in failed_replies and cid not in tracker.get('auto_responded', []):
                    # Comment is stuck: in checked_comments AND failed_replies but NOT auto_responded
                    # Remove it so it gets retried
                    print(f"🧹 Cleanup: Removing stuck comment {cid} from checked list (failed {failed_replies[cid].get('fail_count', 0)} times)")
                    cleanup_count += 1
                else:
                    cleaned.append(cid)
            checked_comments[post_key] = cleaned
        if cleanup_count > 0:
            print(f"🧹 Tracker cleanup complete: {cleanup_count} stuck comments freed for retry")
            tracker['checked_comments'] = checked_comments
        
        # Also clean up auto_responded comments that have been responded (remove from failed_replies)
        auto_responded = tracker.get('auto_responded', [])
        for cid in list(failed_replies.keys()):
            if cid in auto_responded:
                del failed_replies[cid]
                print(f"🧹 Cleanup: Removed {cid} from failed_replies (already auto-responded)")
        
        posts = get_recent_posts()
        if not posts:
            error_msg = "Failed to fetch posts from LinkedIn API"
            print(f"Error: {error_msg}")
            notify_failure(
                "LinkedIn Engagement Monitor",
                Exception(error_msg),
                additional_info="The LinkedIn API request failed. Check token validity."
            )
            return 1
        
        new_activity = False
        total_comments = 0
        total_auto_responded = 0
        total_reactions = 0
        total_likes = 0
        
        for post in posts.get('elements', [])[:3]:  # Check last 3 posts
            post_urn = post.get('id')
            post_text = post.get('specificContent', {}).get('com.linkedin.ugc.ShareContent', {}).get('shareCommentary', {}).get('text', '')[:100]
            
            print(f"Checking post: {post_text}...")
            
            # Get reactions/likes count
            likes_count = get_post_likes_count(post_urn)
            print(f"  📊 Total likes: {likes_count}")
            total_likes += likes_count
            
            # Check for new reactions (if tracking in future)
            reactions_key = post_urn.replace(':', '_') + '_reactions'
            previous_likes = tracker.get('likes_count', {}).get(reactions_key, 0)
            new_reactions = max(0, likes_count - previous_likes)
            if new_reactions > 0:
                print(f"  👍 {new_reactions} new likes!")
                total_reactions += new_reactions
            
            # Update likes tracker
            if 'likes_count' not in tracker:
                tracker['likes_count'] = {}
            tracker['likes_count'][reactions_key] = likes_count
            
            comments = get_post_comments(post_urn)
            if comments is None:
                continue
            
            comment_elements = comments.get('elements', [])
            new_comments = []
            
            checked_key = post_urn.replace(':', '_')
            previously_checked = tracker.get('checked_comments', {}).get(checked_key, [])
            auto_responded_list = tracker.get('auto_responded', [])
            
            for comment in comment_elements:
                comment_id = comment.get('id')
                comment_text = comment.get('message', {}).get('text', '')
                commenter = comment.get('actor', 'Unknown')
                commenter_urn = comment.get('actor', '')  # Get full URN
                comment_urn = comment.get('$URN')  # Full comment URN for threaded replies

                if comment_id not in previously_checked:
                    # Check if we should auto-respond
                    should_respond, response_text = should_auto_respond(
                        comment_text, commenter, commenter_urn, post_urn, tracker
                    )

                    if should_respond and comment_id not in auto_responded_list:
                        print(f"  🤖 Replying to: {commenter}")
                        # Reply to the specific comment (threaded reply with full comment URN)
                        result = reply_to_comment(post_urn, comment_id, response_text, comment_urn)
                        if result:
                            print(f"    ✓ Reply posted as threaded response!")
                            comment['auto_replied'] = True
                            auto_responded_list.append(comment_id)
                            total_auto_responded += 1

                            # Update tracker with timestamp
                            post_key = post_urn.replace(':', '_')
                            if 'last_response_time' not in tracker:
                                tracker['last_response_time'] = {}
                            tracker['last_response_time'][post_key] = datetime.now().isoformat()
                            
                            # Only checkpoint as "checked" if reply succeeded
                            previously_checked.append(comment_id)
                        else:
                            print(f"    ✗ Reply failed — will retry on next run")
                            # Do NOT add to previously_checked so it retries
                            # Track failure for alerting
                            if 'failed_replies' not in tracker:
                                tracker['failed_replies'] = {}
                            tracker['failed_replies'][comment_id] = {
                                'post_urn': post_urn,
                                'comment_text': comment_text[:100],
                                'last_attempt': datetime.now().isoformat(),
                                'fail_count': tracker.get('failed_replies', {}).get(comment_id, {}).get('fail_count', 0) + 1
                            }
                    else:
                        # No auto-response needed (cooldown, short comment, etc.)
                        # Still mark as checked so we don't re-evaluate
                        previously_checked.append(comment_id)

                    new_comments.append(comment)
                else:
                    # Already checked — skip
                    pass
            
            if new_comments or new_reactions > 0:
                if new_comments:
                    print(f"  ✓ {len(new_comments)} new comments ({sum(1 for c in new_comments if c.get('auto_replied'))} auto-responded)")
                if new_reactions > 0:
                    print(f"  ✓ {new_reactions} new likes")
                
                send_engagement_email(
                    post_text, 
                    len(new_comments), 
                    new_comments, 
                    sum(1 for c in new_comments if c.get('auto_replied')),
                    new_reactions,
                    likes_count
                )
                new_activity = True
                total_comments += len(new_comments)
            else:
                print(f"  - No new engagement")
            
            # Update tracker
            if 'checked_comments' not in tracker:
                tracker['checked_comments'] = {}
            tracker['checked_comments'][checked_key] = previously_checked
            tracker['auto_responded'] = auto_responded_list
        
        # Save tracker
        tracker_path.parent.mkdir(parents=True, exist_ok=True)
        with open(tracker_path, 'w') as f:
            json.dump(tracker, f)
        
        # ============================================================
        # CHECK FOR MENTIONS ON OTHER PEOPLE'S POSTS
        # ============================================================
        print("\n" + "-" * 70)
        print("Checking for DIYPREFAB mentions on other posts...")
        print("-" * 70)
        
        # NOTE: Mention search via LinkedIn API is currently disabled
        # The API endpoints used for searching mentions require higher-tier access
        # that is not available with the current API permissions.
        # Core engagement monitoring (own posts) continues to work.
        
        print("  ⏸️  Mention search disabled (API limitation)")
        print("  ✓ Core engagement monitoring active (own posts)")
        
        responded_mentions = 0
        
        # Skip mention search - API returns HTTP 400
        # mentions = search_diyprefab_mentions()
        # network_mentions = check_network_feed_for_mentions()
        
        if responded_mentions > 0:
            print(f"\n✓ Responded to {responded_mentions} new mentions")
            new_activity = True
        else:
            print("  - No new mentions found")
        
        print()
        if new_activity:
            print(f"✓ Engagement check complete! ({total_comments} comments, {total_auto_responded} auto-responded, {total_reactions} new likes)")
            notify_success(
                "LinkedIn Engagement Monitor",
                additional_info=f"Found {total_comments} new comments, {total_reactions} new likes.\nAuto-responded to {total_auto_responded} comments."
            )
        else:
            print("- No new engagement to report")
        
        print("=" * 70)
        return 0
        
    except Exception as e:
        print(f"Error in engagement monitor: {e}")
        notify_failure(
            "LinkedIn Engagement Monitor",
            e,
            additional_info="The engagement monitor encountered an unexpected error."
        )
        return 1

def main():
    return check_engagement()

if __name__ == "__main__":
    exit(main())

/**
 * HubSpot API Integration Service
 * Handles contact creation, form submissions, and deal tracking
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com';
const ACCESS_TOKEN = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN;

/**
 * Create or update a contact in HubSpot
 */
export const createContact = async (contactData) => {
  try {
    const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          email: contactData.email,
          firstname: contactData.firstName || contactData.firstname || '',
          lastname: contactData.lastName || contactData.lastname || '',
          phone: contactData.phone || '',
          company: contactData.company || '',
          jobtitle: contactData.jobTitle || contactData.jobtitle || '',
          // Custom LinkedIn tracking properties
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          lead_source: 'LinkedIn Ads',
          lead_source_detail: contactData.sourceDetail || 'LinkedIn Landing Page',
          linkedin_campaign: contactData.campaign || '',
          // Project info
          project_type: contactData.projectType || '',
          project_size: contactData.projectSize || '',
          timeline_needed: contactData.timeline || '',
        }
      })
    });

    if (!response.ok) {
      // Check if contact already exists (409 conflict)
      if (response.status === 409) {
        console.log('Contact already exists, updating...');
        return updateContactByEmail(contactData.email, contactData);
      }
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('HubSpot contact created:', data.id);
    return { success: true, contactId: data.id, data };
  } catch (error) {
    console.error('HubSpot createContact error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an existing contact by email
 */
export const updateContactByEmail = async (email, contactData) => {
  try {
    // First search for the contact
    const searchResponse = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }]
      })
    });

    const searchData = await searchResponse.json();
    
    if (searchData.results && searchData.results.length > 0) {
      const contactId = searchData.results[0].id;
      
      // Update the contact
      const updateResponse = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            firstname: contactData.firstName || contactData.firstname || '',
            lastname: contactData.lastName || contactData.lastname || '',
            phone: contactData.phone || '',
            company: contactData.company || '',
            jobtitle: contactData.jobTitle || contactData.jobtitle || '',
            lead_source_detail: contactData.sourceDetail || 'LinkedIn Landing Page',
            linkedin_campaign: contactData.campaign || '',
            project_type: contactData.projectType || '',
            project_size: contactData.projectSize || '',
            timeline_needed: contactData.timeline || '',
          }
        })
      });

      const updateData = await updateResponse.json();
      console.log('HubSpot contact updated:', contactId);
      return { success: true, contactId, data: updateData };
    }

    return { success: false, error: 'Contact not found' };
  } catch (error) {
    console.error('HubSpot updateContact error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Submit form data to HubSpot Forms API
 */
export const submitForm = async (formData) => {
  try {
    const portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
    const formId = formData.formId || 'linkedin-landing-form';

    const response = await fetch(
      `${HUBSPOT_API_BASE}/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submittedAt: Date.now(),
          fields: [
            { name: 'email', value: formData.email },
            { name: 'firstname', value: formData.firstName || formData.firstname || '' },
            { name: 'lastname', value: formData.lastName || formData.lastname || '' },
            { name: 'phone', value: formData.phone || '' },
            { name: 'company', value: formData.company || '' },
            { name: 'jobtitle', value: formData.jobTitle || formData.jobtitle || '' },
          ],
          context: {
            pageUri: formData.pageUrl || window.location.href,
            pageName: formData.pageName || document.title,
            source: 'LinkedIn Ads',
            campaign: formData.campaign || '',
          },
          legalConsentOptions: {
            consent: {
              consentToProcess: true,
              text: 'I agree to be contacted about my project inquiry',
              communications: [
                {
                  value: true,
                  subscriptionTypeId: 999,
                  text: 'I agree to receive marketing communications'
                }
              ]
            }
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Form submission error: ${response.status}`);
    }

    const data = await response.json();
    console.log('HubSpot form submitted:', data);
    return { success: true, data };
  } catch (error) {
    console.error('HubSpot submitForm error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create a deal in HubSpot
 */
export const createDeal = async (dealData, contactId) => {
  try {
    const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/deals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          dealname: dealData.dealName || `${dealData.company || 'New'} - LinkedIn Lead`,
          amount: dealData.amount || '',
          dealstage: dealData.stage || 'appointmentscheduled',
          pipeline: dealData.pipeline || 'default',
          closedate: dealData.closeDate || '',
          description: dealData.description || '',
          // Custom properties
          lead_source: 'LinkedIn Ads',
          project_type: dealData.projectType || '',
          project_size: dealData.projectSize || '',
          timeline: dealData.timeline || '',
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Deal creation error: ${response.status}`);
    }

    const data = await response.json();
    
    // Associate deal with contact if contactId provided
    if (contactId) {
      await associateDealWithContact(data.id, contactId);
    }

    console.log('HubSpot deal created:', data.id);
    return { success: true, dealId: data.id, data };
  } catch (error) {
    console.error('HubSpot createDeal error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Associate a deal with a contact
 */
export const associateDealWithContact = async (dealId, contactId) => {
  try {
    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error(`Association error: ${response.status}`);
    }

    console.log('Deal associated with contact:', dealId, contactId);
    return { success: true };
  } catch (error) {
    console.error('HubSpot associateDeal error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Track LinkedIn + HubSpot combined conversion
 */
export const trackConversion = async (conversionData) => {
  // Track in LinkedIn
  if (window.trackLinkedInConversion) {
    window.trackLinkedInConversion(
      conversionData.linkedinConversionId, 
      conversionData.value || 0
    );
  }

  // Create/update contact in HubSpot
  const contactResult = await createContact(conversionData);

  // Create deal if high-value conversion
  if (conversionData.createDeal && contactResult.success) {
    await createDeal(conversionData, contactResult.contactId);
  }

  return contactResult;
};

export default {
  createContact,
  updateContactByEmail,
  submitForm,
  createDeal,
  associateDealWithContact,
  trackConversion
};

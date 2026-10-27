import React from "react";
import { avatarColor, initials } from "./utils";

const Avatar = ({ name, picture, size = 36 }) =>
  picture ? (
    <img className="bt-avatar" src={picture} alt="" width={size} height={size} referrerPolicy="no-referrer" style={{ width: size, height: size }} />
  ) : (
    <span className="bt-avatar bt-avatar--init" aria-hidden="true" style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.38 }}>
      {initials(name)}
    </span>
  );

export default Avatar;

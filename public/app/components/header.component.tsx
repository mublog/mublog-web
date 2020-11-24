import { createElement } from "../../modules/doc/mod"
import UserService from "../services/user.service"

export default function Header() {
  return (
    <header if={UserService.isUser} id="header">
      <div className="header-content">
        <div className="header-profile">
          <div className="user-image-wrap">
            <div className="user-image" />
            <div className="user-image-frame" />
          </div>
        </div>
      </div>
    </header>
  ) as HTMLHeadElement
}
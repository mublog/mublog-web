import Doc, { portal } from "../../mod/doc/mod"
import * as µ from "./mu.component"
import adjustCardPosition from "../helpers/adjust-card-position"
import * as UserService from "../services/user.service"
import i18n from "../../lang/de_DE.json"

const UserCardPortal = portal(UserCard)

async function UserCard({ alias, top, left }) {
  [top, left] = adjustCardPosition(top, left)

  let exist = document.getElementById("user-card")
  if (exist) exist.remove()

  let user = await UserService.getUser(alias)

  // styles={{ backgroundImage: `url(${user.image})` }}

  return (
    <µ.Box
      styles={{ top: `${top}px`, left: `${left}px` }}
      id="user-card"
      onmouseleave={UserCardPortal.close}
    >
      <µ.Header>
        <a href={`/user/${alias}`} styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div className="user-image-wrap">
            <div className="user-image" />
            <div className="avatar-circle" />
          </div>
          <div tooltip={i18n.visitUser.replace("$u", user.displayName)}>
            <div>
              {user.displayName}
            </div>
            <div>
              @{alias}
            </div>
          </div>
        </a>
      </µ.Header>
      <µ.Box arrow="top-left" if={user.description.length > 0}>
        {user.description}
      </µ.Box>
    </µ.Box>
  ) as HTMLElement
}

export default UserCardPortal
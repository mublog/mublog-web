import Doc, { observable, portal, reference } from "../../mod/doc/mod"
import * as µ from "./mu.component"
import adjustCardPosition from "../helpers/adjust-card-position"
import * as UserService from "../services/user.service"
import i18n from "../../lang/de_DE.json"

const UserCardPortal = portal(UserCard)
const existing = () => document.getElementById("user-card")

export async function UserCard({ alias, top, left }) {
  [top, left] = adjustCardPosition(top, left)
  let exist = existing()
  if (exist) exist.remove()

  let user = await UserService.getUser(alias)
  const FollowingReference = reference<µ.IconElement>()
  const Following = observable("user-follow")

  // styles={{ backgroundImage: `url(${user.image})` }}

  return (
    <µ.Box
      styles={{ top: `${top}px`, left: `${left}px` }}
      id="user-card"
      onmouseleave={UserCardPortal.close}
    >
      <µ.Header>
        <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div className="user-image-wrap">
            <div className="user-image" />
            <div className="avatar-circle" />
          </div>
          <a href={`/user/${alias}`} tooltip={i18n.visitUser.replace("$u", user.displayName)} styles={{ flex: "1" }}>
            <div>
              {user.displayName}
            </div>
            <div>
              @{alias}
            </div>
          </a>
          <µ.Icon
            ref={FollowingReference}
            name="user-follow"
            className="cursor-pointer"
            tooltip={i18n.follow}
          />
        </div>
      </µ.Header>
      <µ.Box arrow="top-left" if={user.description.length > 0}>
        {user.description}
      </µ.Box>
    </µ.Box>
  ) as HTMLElement
}

export default UserCardPortal
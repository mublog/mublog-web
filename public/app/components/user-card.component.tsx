import Doc, { usePortal } from "../../modules/doc/mod"
import * as µ from "./mu.component"
import adjustCardPosition from "../helpers/adjust-card-position"

// @ts-expect-error
const UserCardPortal = usePortal(UserCard)

const users = [
  {
    alias: "iljushka",
    displayName: "Ilja B.",
    bio: "Biology is hard"
  }
]

async function UserCard({ alias, top, left }) {
  [top, left] = adjustCardPosition(top, left)
  let user = users.find(u => u.alias === alias)

  if (!user) {
    return document.createComment("oops")
  }

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
          <div styles={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "content" }}>
            <div>
              {user.displayName}
            </div>
            <div>
              @{alias}
            </div>
          </div>
        </a>
      </µ.Header>
      <µ.Box arrow="top-left">
        {user.bio}
      </µ.Box>
    </µ.Box>
  ) as HTMLElement
}

export default UserCardPortal
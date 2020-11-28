import { createElement, usePortal } from "../../modules/doc/mod"
import * as µ from "./mu.component"

const UserCardPortal = usePortal(UserCard)

const users = [
  {
    alias: "iljushka",
    name: "Ilja B.",
    bio: "Biology is hard",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.c1UHJDlTjQie1j7L1eLhFQHaHa%26pid%3DApi&f=1"
  }
]

async function UserCard({ alias, top, left }) {
  top -= 50
  left -= 50
  if (top < 0) {
    top = 0
  }
  if ((innerHeight - top) < 200) {
    top = innerHeight - 200
  }

  let user = users.find(u => u.alias === alias)

  return (
    <µ.Box
      styles={{ top: `${top}px`, left: `${left}px` }}
      id="user-card"
      onmouseleave={UserCardPortal.close}
    >
      <µ.Header>
        <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div className="user-image-wrap">
            <div className="user-image" styles={{ backgroundImage: `url(${user.image})` }} />
            <div className="user-image-frame" />
          </div>
          <div styles={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "content" }}>
            <div>
              {user.name}
            </div>
            <div>
              @{alias}
            </div>
          </div>
        </div>
      </µ.Header>
      <µ.Box arrow="top-left">
        {user.bio}
      </µ.Box>
    </µ.Box>
  ) as HTMLElement
}

export default UserCardPortal
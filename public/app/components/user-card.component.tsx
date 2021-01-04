import Doc, { observable, portal } from "../../mod/doc/mod"
import * as µ from "./mu.component"
import adjustCardPosition from "../helpers/adjust-card-position"
import * as UserService from "../services/user.service"
import i18n from "../../lang/de_DE.json"
import { randomColor } from "../helpers/colors"

const UserCardPortal = portal(UserCard)
const existing = () => document.getElementById("user-card")

export async function UserCard({ alias, top, left }) {
  [top, left] = adjustCardPosition(top, left)
  let exist = existing()
  if (exist) exist.remove()

  let yourUserName = UserService.currentUser().username
  let user = await UserService.getUser(alias)
  const followers = observable(0)
  const following = observable(0)
  const follows = observable(false)
  const followsNot = observable(true)
  follows.subscribe(value => followsNot.set(!value))

  await refreshFollowers()
  await refreshFollowing()

  return (
    <µ.Box styles={{ top: `${top}px`, left: `${left}px` }} id="user-card" onmouseleave={UserCardPortal.close}>
      <µ.Header>
        <div styles={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div className="user-image-wrap">
            <div className="user-image" styles={{ backgroundColor: randomColor() + " !important" }} />
            <div className="avatar-circle" />
          </div>
          <a href={`/user/${alias}`} tooltip={i18n.visitUser.replace("$u", user.displayName)} styles={{ flex: "1" }}>
            <div>
              @{user.username}
            </div>
          </a>
          {alias === yourUserName ? undefined : <FollowButtons />}
        </div>
      </µ.Header>
      <div>{i18n.followers}: {followers}</div>
      <div>{i18n.following}: {following}</div>
      <µ.Box arrow="top-left" if={user.description?.length > 0}>
        <span>{user.description}</span>
      </µ.Box>
    </µ.Box>
  ) as HTMLElement

  function FollowButtons() {
    return (
      <div className="cursor-pointer">
        <div if={UserService.isUser}>
          <µ.Icon if={followsNot} tooltip={i18n.follow} name="user-follow" onclick={follow} />
          <µ.Icon if={follows} tooltip={i18n.unfollow} name="user-unfollow" onclick={unfollow} />
        </div>
      </div>
    ) as HTMLDivElement
  }

  async function follow() {
    await UserService.follow(user.username)
    await refreshFollowers()
    await refreshFollowing()
  }

  async function unfollow() {
    await UserService.unfollow(user.username)
    refreshFollowers()
    refreshFollowing()
  }

  async function refreshFollowers() {
    let list = await UserService.followers(alias)
    followers.set(list.length)
    follows.set(!!list.find(user => user.username === yourUserName))
  }

  async function refreshFollowing() {
    let list = await UserService.following(alias)
    following.set(list.length)
  }
}

export default UserCardPortal
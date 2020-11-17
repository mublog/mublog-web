import createNode from "./src/create-node"
import createText from "./src/create-text"
import useState from "./src/helpers/state"
import useMixin from "./src/helpers/mixin"
import createAnimation from "./src/helpers/animation"
import { useEvent, useEvents } from "./src/helpers/events"
import tagged from "./src/helpers/tagged"
import { mount, unmount } from "./src/helpers/mount"
import { queryAll, query } from "./src/helpers/query"
import { useStyles, useStyleGroup } from "./src/helpers/styles"
import createRouter from "./src/extras/router/module"
import type * as Types from "./src/types"

const Doc = {
    createNode,
    createText,
    createRouter,
    createAnimation,
    queryAll,
    query
}

export {
    useState,
    useMixin,
    useEvent,
    useEvents,
    tagged,
    mount,
    unmount,
    useStyles,
    useStyleGroup,
    queryAll,
    query,
    Types
}

export default Doc
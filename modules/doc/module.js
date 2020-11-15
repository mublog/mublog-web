// @ts-check
import createNode from "./src/create-node.js"
import createText from "./src/create-text.js"
import useState from "./src/helpers/state.js"
import useMixin from "./src/helpers/mixin.js"
import { useEvent, useEvents } from "./src/helpers/events.js"
import tagged from "./src/helpers/tagged.js"
import { mount, unmount } from "./src/helpers/mount.js"
import { queryAll, query } from "./src/helpers/select.js"
import { useStyles, useStyleGroup } from "./src/helpers/styles.js"
import createRouter from "./src/extras/router/module.js"

const Doc = {
    createNode,
    createText,
    createRouter,
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
    query
}

export default Doc
import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from "vue-router";

export const requiredPushedTo = async (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    if (_to.matched.some(record => record.meta.isPushedTo)) {
        if (!_from.name) {
            return next({
                path: `/404`
            })
        } else {
            next()
        }
    } else {
        next()
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/404',
            name: '404',
            component: () => import('../views/errors/404Page.vue')
        },
        {
            path: '/home',
            name: 'HomePage',
            component: () => import('../app/NxWelcome.vue')
        }
    ]
})

export default router
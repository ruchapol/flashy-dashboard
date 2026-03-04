/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from "vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
const auth = useAuthStore();
const avatarLetter = computed(() => auth.user?.username?.charAt(0)?.toUpperCase() ?? "U");
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['primary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "top-bar" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "logo" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "logo" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "nav-actions" },
});
if (__VLS_ctx.auth.isAuthenticated) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        to: "/create",
        ...{ class: "primary-button" },
    }));
    const __VLS_6 = __VLS_5({
        to: "/create",
        ...{ class: "primary-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-menu" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "avatar-circle" },
    });
    (__VLS_ctx.avatarLetter);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "username" },
    });
    (__VLS_ctx.auth.user?.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.isAuthenticated))
                    return;
                __VLS_ctx.auth.logout();
            } },
        type: "button",
        ...{ class: "ghost-btn" },
    });
}
else {
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        to: "/login",
        ...{ class: "ghost-button" },
    }));
    const __VLS_10 = __VLS_9({
        to: "/login",
        ...{ class: "ghost-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        to: "/register",
        ...{ class: "primary-button" },
    }));
    const __VLS_14 = __VLS_13({
        to: "/register",
        ...{ class: "primary-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main" },
});
const __VLS_16 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['user-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            auth: auth,
            avatarLetter: avatarLetter,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

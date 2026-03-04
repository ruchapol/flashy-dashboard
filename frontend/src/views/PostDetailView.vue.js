/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";
const props = defineProps();
const route = useRoute();
const auth = useAuthStore();
const post = ref(null);
const loading = ref(true);
async function load() {
    const id = props.id ?? route.params.id;
    if (!id) {
        loading.value = false;
        return;
    }
    loading.value = true;
    try {
        post.value = await postsApi.fetchPostById(id, auth.token);
    }
    catch {
        post.value = null;
    }
    finally {
        loading.value = false;
    }
}
onMounted(() => load());
watch(() => props.id, () => load());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['view-header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "post-detail" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else if (!__VLS_ctx.post) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        to: "/",
        ...{ class: "back-link" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/",
        ...{ class: "back-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "view-header" },
    });
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        to: "/",
        ...{ class: "back-link" },
    }));
    const __VLS_6 = __VLS_5({
        to: "/",
        ...{ class: "back-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card post-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "post-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "equation" },
    });
    (__VLS_ctx.post.equation_text);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "meta" },
    });
    (__VLS_ctx.post.x_min);
    (__VLS_ctx.post.x_max);
    if (__VLS_ctx.post.caption) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "caption" },
        });
        (__VLS_ctx.post.caption);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "post-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "stats" },
    });
    (__VLS_ctx.post.like_count);
    (__VLS_ctx.post.comment_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card comments-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "comments-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "comments-placeholder" },
    });
}
/** @type {__VLS_StyleScopedClasses['post-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['view-header']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-card']} */ ;
/** @type {__VLS_StyleScopedClasses['post-header']} */ ;
/** @type {__VLS_StyleScopedClasses['equation']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['caption']} */ ;
/** @type {__VLS_StyleScopedClasses['post-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['stats']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-section']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-title']} */ ;
/** @type {__VLS_StyleScopedClasses['comments-placeholder']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            post: post,
            loading: loading,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

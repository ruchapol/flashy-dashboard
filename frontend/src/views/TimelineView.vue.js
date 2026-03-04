/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from "vue";
import PostCard from "@/components/PostCard.vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";
const auth = useAuthStore();
const posts = ref([]);
const nextCursor = ref(null);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref("");
const hasMore = ref(true);
async function load(append) {
    if (append)
        loadingMore.value = true;
    else
        loading.value = true;
    error.value = "";
    try {
        const token = auth.token ?? null;
        const cursor = append ? nextCursor.value ?? undefined : undefined;
        const result = await postsApi.fetchPostsSafe(token, cursor);
        if (append) {
            posts.value.push(...result.items);
        }
        else {
            posts.value = result.items;
        }
        nextCursor.value = result.next_cursor;
        hasMore.value = !!result.next_cursor;
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load posts";
        if (!append)
            error.value = msg;
    }
    finally {
        loading.value = false;
        loadingMore.value = false;
    }
}
function loadMore() {
    if (!nextCursor.value || loadingMore.value)
        return;
    load(true);
}
onMounted(() => load(false));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['timeline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "timeline" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "timeline-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
if (__VLS_ctx.loading && __VLS_ctx.posts.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-placeholder" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else if (__VLS_ctx.error && __VLS_ctx.posts.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-placeholder" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
    if (__VLS_ctx.auth.isAuthenticated) {
        const __VLS_0 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ class: "ghost-button" },
            to: "/create",
        }));
        const __VLS_2 = __VLS_1({
            ...{ class: "ghost-button" },
            to: "/create",
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_3.slots.default;
        var __VLS_3;
    }
    else {
        const __VLS_4 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ class: "ghost-button" },
            to: "/register",
        }));
        const __VLS_6 = __VLS_5({
            ...{ class: "ghost-button" },
            to: "/register",
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_7.slots.default;
        var __VLS_7;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "post-list" },
    });
    for (const [post] of __VLS_getVForSourceType((__VLS_ctx.posts))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (post.id),
        });
        /** @type {[typeof PostCard, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(PostCard, new PostCard({
            post: (post),
        }));
        const __VLS_9 = __VLS_8({
            post: (post),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    }
    if (__VLS_ctx.hasMore && !__VLS_ctx.loadingMore) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "load-more" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.loadMore) },
            type: "button",
            ...{ class: "ghost-button" },
        });
    }
    else if (__VLS_ctx.loadingMore) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "load-more" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "loading-text" },
        });
    }
    else if (__VLS_ctx.posts.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "timeline-placeholder" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        if (__VLS_ctx.auth.isAuthenticated) {
            const __VLS_11 = {}.RouterLink;
            /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
            // @ts-ignore
            const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
                ...{ class: "ghost-button" },
                to: "/create",
            }));
            const __VLS_13 = __VLS_12({
                ...{ class: "ghost-button" },
                to: "/create",
            }, ...__VLS_functionalComponentArgsRest(__VLS_12));
            __VLS_14.slots.default;
            var __VLS_14;
        }
    }
}
/** @type {__VLS_StyleScopedClasses['timeline']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-header']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['post-list']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
/** @type {__VLS_StyleScopedClasses['load-more']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-button']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PostCard: PostCard,
            auth: auth,
            posts: posts,
            loading: loading,
            loadingMore: loadingMore,
            error: error,
            hasMore: hasMore,
            loadMore: loadMore,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

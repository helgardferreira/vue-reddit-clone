<template>
    <div id="app">
        <Post
            v-for="(post, index) in posts"
            :key="index"
            :post-data="post"
            :rank="index + 1"
        />
    </div>
</template>

<script>
import Post from './components/Post.vue';

export default {
    name: 'App',
    components: {
        Post,
    },
    data() {
        return {
            posts: [],
        };
    },
    mounted() {
        fetch('https://www.reddit.com/.json')
            .then((res) => res.json())
            .then((obj) => {
                // Mapped identity function
                const posts = obj.data.children.map(({ data, }) => data);

                this.posts = posts;
            });
    },
};
</script>

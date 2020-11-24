<template>
    <div class="content-row">
        <div class="rank">
            {{ rank }}
        </div>
        <div class="votes">
            {{ upvoteCount }}
        </div>
        <a
            :href="permalink"
            class="thumbnail"
        >
            <img
                width="70"
                :src="thumbnail"
            >
        </a>
        <div class="entry">
            <div>
                <div>
                    <a
                        :href="url"
                        class="title"
                    >
                        {{ title }}
                    </a>
                </div>
                <div
                    v-if="showExpando"
                    class="expando-button"
                    :style="{backgroundImage:
                        !showContent
                            ? `url(${require('../assets/expand-icon.png')})`
                            : `url(${require('../assets/collapse-icon.png')})`
                    }"
                    @click="showContent = !showContent"
                />
                <p class="tagline">
                    submitted {{ createdAt }} hours ago by {{ author }} to
                    {{ subredditName }}
                    <span v-if="awards.length > 0">
                        <div
                            v-for="award in awards"
                            :key="award.url"
                            class="award"
                        >
                            <img
                                height="12"
                                width="12"
                                :src="award.iconUrl"
                            >{{ award.count }}
                        </div>
                    </span>
                </p>
                <a
                    :href="permalink"
                    class="comments-link"
                >
                    {{ commentCount }} comments
                </a>
            </div>
            <!-- v-html *might* be fine in this context since the selftext_html
                text is escaped and lodash.unescape only escapes *certain* html codes -->
            <!-- In the VAST MAJORITY of cases I wouldn't use v-html for XSS concerns -->
            <!-- eslint-disable vue/no-v-html -->
            <div
                v-if="showContent && richtext"
                v-html="richtext"
            />
            <img
                v-if="showContent && previewImage"
                class="preview-image"
                :src="previewImage.url"
                :height="previewImage.height"
                :width="previewImage.width"
            >
            <video
                v-if="showContent && previewVideoUrl"
                width="500"
                height="300"
                controls
            >
                <source :src="previewVideoUrl">
            </video>
            <div
                v-if="showContent && mediaEmbed"
                v-html="mediaEmbed"
            />
        </div>
        <div class="clearleft" />
    </div>
</template>


<script>
import unescape from 'lodash.unescape';

export default {
    name: 'Post',
    props: {
        postData: {
            type: Object,
            required: true,
        },
        rank: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showContent: false,
        };
    },
    computed: {
        createdAt() {
            const diffTime =
                Date.now() - new Date(this.postData.created_utc * 1000);

            // Returns num hours since post has been created
            return Math.ceil(diffTime / (1000 * 60 * 60));
        },
        title() { return this.postData.title; },
        author() { return this.postData.author; },
        commentCount() { return this.postData.num_comments; },
        subredditName() { return this.postData.subreddit_name_prefixed; },
        url() { return this.postData.url; },
        permalink() { return `https://old.reddit.com${this.postData.permalink}`; },
        thumbnail() {
            if (!this.isDisplayableThumbnail)
                return require('../assets/link-icon.png');
            if (this.postData.thumbnail === 'nsfw')
                return require('../assets/nsfw-icon.png');
            return this.postData.thumbnail;
        },
        isDisplayableThumbnail() {
            return (
                this.postData.thumbnail !== 'self' &&
                this.postData.thumbnail !== 'default' &&
                this.postData.thumbnail !== '' &&
                this.postData.thumbnail !== null &&
                this.postData.thumbnail !== undefined
            );
        },
        upvoteCount() {
            let upvotes = this.postData.ups;

            if (upvotes > 10000) upvotes = `${Math.round(upvotes / 100) / 10}k`;
            return upvotes;
        },
        richtext() {
            return unescape(this.postData.selftext_html);
        },
        previewImage() {
            if (
                this.postData.preview === undefined
                || this.postData.preview === null
                || this.postData.preview.enabled === false
                || this.postData.preview.images === undefined
                || this.postData.preview.images.length === 0
            )
                return null;

            return {
                url: unescape(this.postData.preview.images[0].source.url),
                height: this.postData.preview.images[0].source.height,
                width: this.postData.preview.images[0].source.width,
            };
        },
        previewVideoUrl() {
            if (
                this.postData.media === undefined
                || this.postData.media === null
                || this.postData.media.reddit_video === undefined
                || this.postData.media.reddit_video.fallback_url === undefined
            )
                return null;

            return this.postData.media.reddit_video.fallback_url;
        },
        mediaEmbed() {
            if (
                this.postData.media_embed === undefined
                || this.postData.media_embed === null
                || this.postData.media_embed.content === undefined
            )
                return null;

            return unescape(this.postData.media_embed.content);
        },
        awards() {
            return this.postData.all_awardings.map(({icon_url, count, }) => ({
                iconUrl: icon_url,
                count,
            }));
        },
        showExpando() {
            return this.previewImage || this.richtext || this.previewVideoUrl || this.mediaEmbed;
        },
    },
};
</script>

<style scoped>
p {
    margin: 0;
}

a {
    color: #369;
}

.content-row {
    margin: 10px 4px;
}

.entry {
    overflow: hidden;
}

.expando-button {
    height: 30px;
    width: 30px;
    background-size: contain;
    background-color: #c6c6c6;
    border-radius: 4px;
    margin-right: 5px;
    float: left;
}

.award {
    display: inline-block;
}

.award:not(:last-of-type) {
    margin-right: 4px;
}

.expando-button:hover {
    cursor: pointer;
    background-color: #369;
}

.preview-image {
    max-width: 500px;
    height: auto;
}

.rank {
    margin-top: 15px;
    font-size: 20px;
    font-weight: bold;
    color: #c6c6c6;
    width: 2.2ex;
    text-align: right;
    float: left;
}

.votes {
    margin: 15px 8px 0 8px;
    color: #c6c6c6;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    width: 6.1ex;
    float: left;
}

.thumbnail {
    width: 70px;
    min-height: 70px;
    margin-right: 8px;
    float: left;
}

.clearleft {
    clear: left;
    height: 0px;
}

.title {
    font-size: 20px;
    color: #0000ff;
    text-decoration: none;
}

.title:visited {
    color: #551a8b;
}

.tagline {
    color: #888;
    font-size: 14px;
    font-weight: bold;
}

.comments-link {
    color: #888;
    font-size: 14px;
    font-weight: bold;
    text-decoration: none;
}

.comments-link:hover {
    text-decoration: underline;
}
</style>

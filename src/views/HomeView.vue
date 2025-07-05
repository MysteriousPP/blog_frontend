<template>
  <article-list :articles="articles" />
</template>

<script setup>
import ArticleList from '@/components/ArticleList.vue'
import useArticles from '@/composables/useArticles'

const { articles } = useArticles()
</script>
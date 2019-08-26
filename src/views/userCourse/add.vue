<template>
  <course-detail :is-edit="false" />
</template>
<script>
import CourseDetail from './components/CourseDetail'
export default {
  name: 'AddCourse',
  components: { CourseDetail }
}
</script>
<style>
</style>


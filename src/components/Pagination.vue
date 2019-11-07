<template>
  <div class="Pagination">
    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalPage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    page: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    handleSizeChange(val) {
      this.loading = true;
      this.page.pageSize = val;
      this.$emit("initPages")
    },

    handleCurrentChange(val) {
      this.loading = true;
      this.page.currentPage = val;
      this.$emit("initPages")
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        size="mini"
        @click="handleAddProductCate()"
      >
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        v-loading="listLoading"
        style="width: 100%"
        :data="list"
        border
      >
        <!--        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>-->
        <el-table-column label="分类图标" align="center" width="120">
          <template slot-scope="scope">
            <div class="icon-img">
              <img :src="scope.row.icon" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.category_name }}</template>
        </el-table-column>
        <el-table-column label="分类简介" align="center">
          <template slot-scope="scope">{{ scope.row.category_title }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.memo }}</template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change="handleShowStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import {fetchList,deleteProductCate,updateShowStatus,updateNavStatus} from '@/api/articleCate'
import { fetchList, deleteCategory, updateCategoryStatus } from '@/api/articleCate'
export default {
  name: 'ProductCateList',
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return '一级'
      } else if (value === 1) {
        return '二级'
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      parentId: 0
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getList()
    }
  },
  created() {
    this.resetParentId()
    this.getList()
  },
  methods: {
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
    },
    handleAddProductCate() {
      this.$router.push('/articleCate/add')
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.docs
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleShowStatusChange(index, row) {
      // let data = new URLSearchParams();

      updateCategoryStatus({ id: row._id, status: row.status }).then(response => {
        console.log(response)
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleTransferProduct(index, row) {
      console.log('handleAddProductCate')
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/articleCate/update', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory({ id: row.id }).then(response => {
          console.log(response)
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .icon-img {
    width: 60px;
    height: 60px;
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>

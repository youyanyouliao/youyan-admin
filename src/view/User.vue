<template>
  <div class="container">
    <div class="search-tool">
      <a-input placeholder="请输入手机号" class="phoneIpt" v-model="queryPhone" />
      <a-button type="primary" class="searchBtn" @click="search">查询</a-button>
    </div>
    <a-table :columns="columns" :dataSource="userList" :pagination="false" :loading="isLoading">
      <span slot="action" slot-scope="record">
        <a href="javascript:;" @click="deleteUser(record.key)">删除</a>
      </span>
    </a-table>
    <div class="pagination-wrap">
      <a-pagination
        :pageSizeOptions="pageSizeOptions"
        :total="total"
        showSizeChanger
        :pageSize="pageSize"
        v-model="currentPage"
        @change="onChange"
        @showSizeChange="onShowSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value!=='50'">{{props.value}}条/页</span>
          <span v-if="props.value==='50'">全部</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const columns = [
  {
    title: "编号",
    dataIndex: "index",
    key: "index"
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone"
  },
  {
    title: "密码",
    dataIndex: "password",
    key: "password"
  },
  {
    title: "创建时间",
    dataIndex: "dateTime",
    key: "dateTime"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  data() {
    return {
      userList: [],
      columns,
      queryPhone: "",
      isLoading: false,
      pageSizeOptions: ["10","15","20","30"],
      currentPage: 1,
      pageSize: 10,
      total: 50
    };
  },
  mounted() {
    this.queryUserList();
  },
  methods: {
    onShowSizeChange(current, size) {
      console.log(current, size);
      this.pageSize = size;
      this.queryUserList();
    },
    onChange(page, pageSize) {
      console.log(page, pageSize);
      this.currentPage = page;
      this.queryUserList();
    },
    search() {
      console.log(this.queryPhone);
      this.queryUserList(this.queryPhone);
    },
    deleteUser(ids) {
      let that = this;
      this.$confirm({
        title: "删除记录将无法恢复，确认删除吗?",
        onOk() {
          axios
            .post("/adminApi/deleteUserById", {
              id: ids
            })
            .then(res => {
              console.log(res);
              that.queryUserList();
            })
            .catch(err => {
              console.log(err);
            });
        },
        onCancel() {
          
        }
      });
    },
    queryUserList(queryPhone) {
      let queryStr = "";
      if (queryPhone) {
        queryStr = `/adminApi/getUserList?currentPage=${this.currentPage}&pageSize=${this.pageSize}&phone=${queryPhone}`;
      } else {
        queryStr = `/adminApi/getUserList?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      }
      this.userList.splice(0);
      this.isLoading = true;
      axios
        .get(queryStr)
        .then(res => {
          console.log(res);
          let tmpResult = res.data.data.data;
          for (let i = 0; i < tmpResult.length; i++) {
            this.userList.push({
              key: tmpResult[i].id,
              index: tmpResult[i].id,
              phone: tmpResult[i].phone,
              password: tmpResult[i].password,
              dateTime: tmpResult[i].dateTime
            });
          }
          this.total = res.data.data.total;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .search-tool {
    display: flex;
    margin-bottom: 20px;
    .phoneIpt {
      width: 180px;
    }
    .searchBtn {
      margin-left: 12px;
    }
  }
  .pagination-wrap {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
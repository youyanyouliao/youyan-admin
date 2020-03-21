<template>
  <div class="container">
    <div class="search-tool">
      <a-input placeholder="请输入活动名称" class="phoneIpt" v-model="queryPhone" />
      <a-button type="primary" class="searchBtn" @click="search">查询</a-button>
      <a-button type="primary" class="addBtn" @click="openAddDialog">新增</a-button>
    </div>
    <a-table :columns="columns" :dataSource="activityList" :pagination="false" :loading="isLoading">
      <template slot="coverUrl" slot-scope="record">
        <img :src="record" class="coverImg" />
      </template>
      <span slot="action" slot-scope="record">
        <a href="javascript:;" @click="openEditDialog(record.key)">修改</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="deleteActivity(record.key)">删除</a>
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
    <!--添加框-->
    <a-modal title="新增活动" v-model="addDialogVisible" :closable="true" :footer="null">
      <a-form :form="addForm" @submit="addSubmit">
        <a-form-item label="封面" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-upload
            listType="picture"
            :fileList="addFileList"
            :customRequest="addUploadImg"
            :remove="addRemoveImg"
            accept=".png, .jpg"
            class="upload-list-inline"
            v-decorator="['coverUrl', { rules: [{ required: true, message: '请上传活动封面!' }] }]"
          >
            <a-button :disabled="canAddImg">
              <a-icon type="upload" />upload
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="活动名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入活动名称!' }] }]" />
        </a-form-item>
        <a-form-item label="活动日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['dateTime', { rules: [{ required: true, message: '请输入活动日期!' }] }]"
          />
        </a-form-item>
        <a-form-item label="活动地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['address', { rules: [{ required: true, message: '请输入活动地址!' }] }]" />
        </a-form-item>
        <a-form-item label="人数限制" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['people', { rules: [{ required: true, message: '请输入人数限制!' }] }]" />
        </a-form-item>
        <a-form-item label="活动类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['type', { rules: [{ required: true, message: '请输入活动类型!' }] }]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" style="width:180px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!--修改框-->
    <a-modal title="修改活动" v-model="editDialogVisible" :closable="true" :footer="null">
      <a-form :form="editForm" @submit="editSubmit">
        <a-form-item label="封面" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-upload
            listType="picture"
            :customRequest="editUploadImg"
            :remove="editRemoveImg"
            v-decorator="[ 'upload', { valuePropName: 'fileList',rules:[{required:true,message:'请上传图片'}],getValueFromEvent: normFile}]"
            accept=".png, .jpg"
            class="upload-list-inline"
          >
            <a-button :disabled="canEditImg">
              <a-icon type="upload" />upload
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="活动Id"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          v-show="false"
        >
          <a-input v-decorator="['id', { rules: [{ required: true, message: '请输入活动Id!' }] }]" />
        </a-form-item>
        <a-form-item label="活动名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入活动名称!' }] }]" />
        </a-form-item>
        <a-form-item label="活动日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['dateTime', { rules: [{ required: true, message: '请输入活动日期!' }] }]"
          />
        </a-form-item>
        <a-form-item label="活动地址" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['address', { rules: [{ required: true, message: '请输入活动地址!' }] }]" />
        </a-form-item>
        <a-form-item label="人数限制" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['people', { rules: [{ required: true, message: '请输入人数限制!' }] }]" />
        </a-form-item>
        <a-form-item label="活动类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['type', { rules: [{ required: true, message: '请输入活动类型!' }] }]" />
        </a-form-item>
        <a-form-item label="活动状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['status', { rules: [{ required: true, message: '请输入活动状态!' }] }]" />
        </a-form-item>
        <a-form-item label="首页推荐" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-switch v-decorator="['isRecommend',{valuePropName:'checked'}]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" style="width:180px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
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
    title: "封面",
    dataIndex: "coverUrl",
    key: "coverUrl",
    scopedSlots: { customRender: "coverUrl" }
  },
  {
    title: "活动名称",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "活动日期",
    dataIndex: "dateTime",
    key: "dateTime"
  },
  {
    title: "活动地址",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "人数限制",
    dataIndex: "people",
    key: "people"
  },
  {
    title: "活动状态",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "活动类型",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "首页推荐",
    dataIndex: "isRecommend",
    key: "isRecommend"
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
      activityList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      formLayout: "horizontal",
      addForm: this.$form.createForm(this, { name: "addActivity" }),
      editForm: this.$form.createForm(this, { name: "editActivity" }),
      addFileList: [],
      editFileList: [],
      canAddImg: false,
      canEditImg: false,
      columns,
      queryPhone: "",
      isLoading: false,
      pageSizeOptions: ["10", "15", "20", "30"],
      currentPage: 1,
      pageSize: 10,
      total: 50
    };
  },
  mounted() {
    this.queryActivityList();
  },
  methods: {
    onShowSizeChange(current, size) {
      console.log(current, size);
      this.pageSize = size;
      this.queryActivityList();
    },
    onChange(page, pageSize) {
      console.log(page, pageSize);
      this.currentPage = page;
      this.queryActivityList();
    },
    search() {
      console.log(this.queryPhone);
      this.queryActivityList(this.queryPhone);
    },
    addSubmit(e) {
      e.preventDefault();
      console.log(this.addForm);
      this.addForm.validateFields((err, values) => {
        if (!err) {
          values.coverUrl = this.addFileList[0].url;
          this.requestAddActivity(values);
        }
      });
    },
    editSubmit(e) {
      e.preventDefault();
      this.editForm.validateFields((err, values) => {
        if (!err) {
          values.coverUrl = this.editFileList[0].url;
          values.isRecommend = values.isRecommend ? "1" : "0";
          console.log(values);
          this.requestEditActivity(values);
        }
      });
    },
    requestAddActivity(paramObj) {
      axios
        .post("adminApi/addActivity", paramObj)
        .then(res => {
          console.log(res);
          this.isLoading = false;
          this.addDialogVisible = false;
          this.$notification["success"]({
            message: "添加成功!"
          });
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$notification["error"]({
            message: "添加失败!"
          });
        });
    },
    requestEditActivity(paramObj) {
      axios
        .post("adminApi/editActivity", paramObj)
        .then(res => {
          console.log(res);
          this.isLoading = false;
          this.queryActivityList();
          this.editDialogVisible = false;
          this.$notification["success"]({
            message: "修改成功!"
          });
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$notification["error"]({
            message: "修改失败!"
          });
        });
    },
    addUploadImg(fileInfo) {
      const data = new FormData();
      data.append("file", fileInfo.file);
      this.isLoading = true;
      axios
        .post("adminApi/uploadActivityCoverImg", data, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          //  console.log(this.addFileList)
          this.addFileList.push({
            uid: new Date().getTime(),
            name: res.data.message.name,
            status: "done",
            url: "http://127.0.0.1:5000" + res.data.message.imgUrl,
            thumbUrl: "http://127.0.0.1:5000" + res.data.message.imgUrl
          });
          this.canAddImg = true;
          this.isLoading = false;
          this.$notification["success"]({
            message: "上传成功!"
          });
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$notification["error"]({
            message: "上传失败!"
          });
        });
    },
    editUploadImg(fileInfo) {
      const data = new FormData();
      data.append("file", fileInfo.file);
      this.isLoading = true;
      axios
        .post("adminApi/uploadActivityCoverImg", data, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          this.editFileList.push({
            uid: new Date().getTime(),
            name: res.data.message.name,
            status: "done",
            url: "http://127.0.0.1:5000" + res.data.message.imgUrl,
            thumbUrl: "http://127.0.0.1:5000" + res.data.message.imgUrl
          });
          this.editForm.setFieldsValue({
            upload: this.editFileList
          });
          this.canEditImg = true;
          this.isLoading = false;
          this.$notification["success"]({
            message: "上传成功!"
          });
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$notification["error"]({
            message: "上传失败!"
          });
        });
    },
    addRemoveImg(fileInfo) {
      return new Promise((resolve, reject) => {
        let result = this.addFileList.find(item => item.uid === fileInfo.uid);
        if (result) {
          this.addFileList.pop();
          this.canAddImg = false;
          resolve(result);
        } else {
          reject();
        }
      });
    },
    editRemoveImg(fileInfo) {
      return new Promise((resolve, reject) => {
        let result = this.editFileList.find(item => item.uid === fileInfo.uid);
        if (result) {
          this.editFileList.pop();
          this.editForm.setFieldsValue({
            upload: this.editFileList
          });
          this.canEditImg = false;
          resolve(result);
        } else {
          reject();
        }
      });
    },
    queryActivityList() {
      let queryStr = "";
      queryStr = `/adminApi/getActivityList?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      // if (queryPhone) {
      //   queryStr = `/adminApi/getUserList?currentPage=${this.currentPage}&pageSize=${this.pageSize}&phone=${queryPhone}`;
      // } else {
      //   queryStr = `/adminApi/getUserList?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      // }
      this.activityList.splice(0);
      this.isLoading = true;
      axios
        .get(queryStr)
        .then(res => {
          console.log(res);
          let tmpResult = res.data.data.data;
          for (let i = 0; i < tmpResult.length; i++) {
            if (tmpResult[i].status == 2) {
              tmpResult[i].status = "已结束";
            } else if (tmpResult[i].status == 1) {
              tmpResult[i].status = "进行中";
            } else {
              tmpResult[i].status = "未开始";
            }
            if (tmpResult[i].isRecommend == 1) {
              tmpResult[i].isRecommend = "是";
            } else {
              tmpResult[i].isRecommend = "否";
            }
            this.activityList.push({
              key: tmpResult[i].id,
              index: tmpResult[i].id,
              coverUrl: tmpResult[i].coverUrl,
              name: tmpResult[i].name,
              dateTime: tmpResult[i].dateTime,
              address: tmpResult[i].address,
              people: tmpResult[i].people,
              status: tmpResult[i].status,
              type: tmpResult[i].type,
              isRecommend: tmpResult[i].isRecommend
            });
          }
          this.total = res.data.data.total;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    },
    openAddDialog() {
      this.addDialogVisible = true;
    },
    openEditDialog(ids) {
      let queryStr = "";
      queryStr = `/adminApi/getActivityById?id=${ids}`;
      this.editDialogVisible = true;
      axios
        .get(queryStr)
        .then(res => {
          console.log(res);
          let tmpResult = res.data.message[0];
          if (tmpResult.status == 2) {
            tmpResult.status = "已结束";
          } else if (tmpResult.status == 1) {
            tmpResult.status = "进行中";
          } else {
            tmpResult.status = "未开始";
          }
          if (tmpResult.isRecommend == 1) {
            tmpResult.isRecommend = true;
          } else {
            tmpResult.isRecommend = false;
          }
          this.editFileList.splice(0);
          this.editFileList.push({
            uid: new Date().getTime(),
            name: tmpResult.name,
            status: "done",
            url: tmpResult.coverUrl,
            thumbUrl: tmpResult.coverUrl
          });
          this.canEditImg = true;
          this.editForm.setFieldsValue({
            id: ids,
            name: tmpResult.name,
            dateTime: tmpResult.dateTime,
            address: tmpResult.address,
            people: tmpResult.people,
            type: tmpResult.type,
            status: tmpResult.status,
            isRecommend: tmpResult.isRecommend,
            upload: this.editFileList
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteActivity(ids) {
      let that = this;
      this.$confirm({
        title: "删除记录将无法恢复，确认删除吗?",
        onOk() {
          axios
            .post("/adminApi/deleteActivityById", {
              id: ids
            })
            .then(res => {
              console.log(res);
              that.queryActivityList();
            })
            .catch(err => {
              console.log(err);
            });
        },
        onCancel() {}
      });
    },
    normFile(e) {
      console.log("Upload event:", e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
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
    .addBtn {
      margin-left: 12px;
    }
  }
  .coverImg {
    min-width: 120px;
    height: auto;
  }
  .pagination-wrap {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
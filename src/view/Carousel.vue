<template>
  <div class="container">
    <div class="add-tool">
      <a-upload name="file" :customRequest="uploadImg" accept=".png, .jpg" :showUploadList="false">
        <a-button type="primary" class="addBtn" :loading="isLoading">新增</a-button>
      </a-upload>
    </div>
    <a-table :columns="columns" :dataSource="imgList" :pagination="false" :loading="isLoading">
      <template slot="imgUrl" slot-scope="record">
        <img :src="record" class="carouseImg" />
      </template>
      <span slot="action" slot-scope="record">
        <a href="javascript:;" @click="deleteImg(record.key)">删除</a>
      </span>
    </a-table>
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
    title: "图片",
    dataIndex: "imgUrl",
    key: "imgUrl",
    scopedSlots: { customRender: "imgUrl" }
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime"
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
      imgList: [],
      columns,
      isLoading: false
    };
  },
  mounted() {
    // this.queryUserList();
    // this.imgList = [
    //   {
    //     key: 0,
    //     index: 0,
    //     imgUrl:
    //       "http://img.hidongtv.com/emecc/d5ba4ceaf4674a5d816b2de1912aac3a",
    //     createTime: "2020-02-24"
    //   }
    // ];
    this.queryCarouselList();
  },
  methods: {
    uploadImg(fileInfo) {
      const data = new FormData();
      data.append("file", fileInfo.file);
      this.isLoading = true;
      axios
        .post("adminApi/uploadCarousel", data, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          this.isLoading = false;
          this.$notification["success"]({
            message: "上传成功!"
          });
          this.queryCarouselList();
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          this.$notification["error"]({
            message: "上传失败!"
          });
        });
    },
    deleteImg(ids) {
      let that = this;
      this.$confirm({
        title: "删除记录将无法恢复，确认删除吗?",
        onOk() {
          axios
            .post("/adminApi/deleteCarouselById", {
              id: ids
            })
            .then(res => {
              console.log(res);
              that.queryCarouselList();
            })
            .catch(err => {
              console.log(err);
            });
        },
        onCancel() {
        }
      });
    },
    queryCarouselList() {
      this.imgList.splice(0);
      this.isLoading = true;
      axios
        .get("/adminApi/getCarouselList")
        .then(res => {
          console.log(res);
          let tmpList = res.data.message;
          this.isLoading = false;
          for (let i = 0; i < tmpList.length; i++) {
            this.imgList.unshift({
              key: tmpList[i].id,
              index: tmpList[i].id,
              imgUrl: "http://127.0.0.1:5000" + tmpList[i].imgUrl,
              createTime: tmpList[i].createTime
            });
          }
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
  .add-tool {
    display: flex;
    margin-bottom: 20px;
    .addBtn {
      margin-left: 12px;
    }
  }
  .carouseImg {
    min-width: 120px;
    height: auto;
  }
}
</style>
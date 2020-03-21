<template>
  <div class="header-container">
    <div class="system-info-wrap">
      <div class="logo"></div>
      <div class="system-name">有言管理中台</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.header-container {
  height: 65px;
  background: linear-gradient(
    90deg,
    rgba(32, 160, 255, 1) 0%,
    rgba(101, 141, 245, 1) 100%
  );
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left:22px;
  padding-right: 22px;
  .system-info-wrap {
    display: flex;
    align-items: center;
    .logo {
      width: 28px;
      height: 28px;
      background-color: #fff;
    }
    .system-name {
      font-size: 24px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      margin-left:20px;
    }
  }
}
</style>
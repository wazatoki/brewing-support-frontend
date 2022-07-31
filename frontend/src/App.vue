<template>
  <div>
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item index="0"
        ><router-link to="/">brewery support</router-link></el-menu-item
      >
      <el-menu-item index="1"
        ><router-link to="/about">About</router-link></el-menu-item
      >
      <el-menu-item index="2"
        ><router-link to="/brewing-record">醸造記録</router-link></el-menu-item
      >
      <el-menu-item index="3"
        ><router-link to="/stocks/recieving">入荷</router-link></el-menu-item
      >
      <el-sub-menu index="4">
        <template #title>各種マスタ</template>
        <el-menu-item index="4-1"
          ><router-link to="/master-unit">単位</router-link></el-menu-item
        >
        <el-menu-item index="4-2"
          ><router-link to="/master-ingredient">原料</router-link></el-menu-item
        >
      </el-sub-menu>
    </el-menu>

    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<template>
  <div id="users">
    <header>
      <!-- 面包屑管理区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: this.$route.path }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-card>
      <div style="margin:0 0 15px;">
        <el-row>
          <el-col :span="6">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="ordersinfo.query"
              @clear="getorders"
            >
              <el-button slot="append" icon="el-icon-search" @click="getorders"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table :data="ordersdata" border style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="440px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="130px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="130px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            <span>{{scope.row.create_time|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary">
            <i class="el-icon-edit" @click="getAddressChange">修</i>
          </el-button>
          <el-button type="success">
            <i class="el-icon-location" style="color:#fff" @click="getlocation">物</i>
          </el-button>
        </el-table-column>
      </el-table>
      <!-- 分页管理 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersinfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="ordersinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改地址 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editadressvisible"
        width="50%"
        @close="addresshandleClose"
      >
        <el-form
          :model="addressform"
          :rules="addressformrules"
          ref="addressform"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="县市区/县" prop="address1">
            <el-cascader
              v-model="addressform.address1"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressform.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editadressvisible = false">取 消</el-button>
          <el-button type="primary" @click="editadressvisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流进度 -->
      <el-dialog title="物流进度" :visible.sync="progressvisible" width="50%">
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in locationData "
            :key="index"
            :timestamp="activity.ftime"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import citydata from "./citydata.js";
export default {
  data() {
    return {
      ordersdata: [],
      ordersinfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //   修改地址数据
      editadressvisible: false,
      citydata,
      addressform: {
        address1: "",
        address2: ""
      },
      addressformrules: {
        address1: [
          { required: true, message: "请输入县市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      progressvisible: false,
      locationData: []
    };
  },
  created() {
    this.getorders();
  },
  methods: {
    async getorders() {
      let { data: res } = await this.$axios.get("orders", {
        params: this.ordersinfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.ordersdata = res.data.goods;
      this.total = res.data.total;
      this.$message.success("数据渲染成功");
    },
    // 分页管理
    handleSizeChange(val) {
      this.ordersinfo.pagesize = val;
      this.getorders();
    },
    handleCurrentChange(val) {
      this.ordersinfo.pagenum = val;
      this.getorders();
    },
    addresshandleClose() {
      this.$refs.addressform.resetFields();
    },
    getAddressChange() {
      this.editadressvisible = true;
    },
    // 请求物流消息
    async getlocation() {
      let { data: res } = await this.$axios.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.locationData = res.data;
      this.progressvisible = true;
    }
  }
};
</script>
<style lang="stylus">
#users
  header
    padding-bottom 20px
  .el-table
    margin-bottom 20px
  .cell
    text-align center
    font-weight normal
  .el-pager li:not(.disabled).active
    background-color #8dd35f
  .el-pagination
    text-align right
  .el-card
    box-shadow 0 1px 1px rgba(0, 0, 0, 0.15)
  .el-cascader
    width 100%
</style>
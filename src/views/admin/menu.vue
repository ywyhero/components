<template>
	<div class="menu"
		v-loading.fullscreen.lock="loading">
		<div class="menu-header">
			<el-button type="primary" size="small" @click="addMenu">新增</el-button>
		</div>
		<div class="menu-main">
			<el-table :data="dataList" border style="width: 100%;">
				<el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
				<table-tree-column prop="name" header-align="center" treeKey="id" label="名称"></table-tree-column>
				<el-table-column prop="type" header-align="center" align="center" label="类型">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
						<el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
						<el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="orderNum" header-align="center" align="center" label="排序号"></el-table-column>
				<el-table-column
					prop="url"
					header-align="center"
					align="center"
					width="150"
					:show-overflow-tooltip="true"
					label="菜单URL"
				></el-table-column>
				<el-table-column
					prop="perms"
					header-align="center"
					align="center"
					width="150"
					:show-overflow-tooltip="true"
					label="授权标识"
				></el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
					<template slot-scope="scope">
						<el-button
							type="text"
							class="menu-handle-edit"
							@click="addOrUpdateHandle(scope.row)"
						>修改</el-button>
						<el-button
							class="menu-handle-delete"
							type="text"
							@click="deleteHandle(scope.row)"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<menu-dialog
			v-if="menuLists.length > 0"
			:title="title"
			:isShow="isShow"
			:data="menuLists"
			:typeRadio="typeRadio"
			:name="menuName"
			:menuVal="preMenu"
			:menuUrl="menuUrl"
			:prePMenuId="preMenuId"
			:tag="menuTag"
			:id="id"
			:orderNum="orderNum"
			@changeType="changeType"
			@changeMenuName="changeMenuName"
			@nodeClick="nodeClick"
			@changeMenuTag="changeMenuTag"
			@changeOrder="changeOrder"
			@changeMenuRouter="changeMenuRouter"
			@addMenu="addNewMenu"
			@editMenu="editMenu"
			@closeDialog="closeDialog"
		></menu-dialog>
	</div>
</template>
<script>
import TableTreeColumn from "./../../components/table-tree-column/index";
import menuDialog from "./../../components/userDialog/menuDialog";
import { treeDataTranslate } from "./../../util/index";
import { admin } from "./../../service/index";
import { mapActions } from "vuex";
export default {
	data() {
		return {
			title: "新增", // 弹框头部名称
			dataList: [], // 菜单列表
			isShow: false, // 是否显示弹框
			menuName: "", // 菜单名称
			preMenu: "", // 上一级菜单
			typeRadio: 0, // 类型选择
			menuUrl: "", // 菜单路由
			menuTag: "", // 授权标识
			orderNum: 0, // 排序号
			preMenuId: 0, // 上级菜单id
			id: 0, // 当前修改的菜单id
			menuLists: [], // 选择的菜单列表
			loading: false
		};
	},
	// 路由进入的事件
	beforeRouteEnter(to, from, next) {
		next(vm => {
		vm.routeList =
			to.meta.routeList.length > 1
			? to.meta.routeList.splice(0, to.meta.routeList.length - 1)
			: to.meta.routeList;
		});
	},
	components: {
		TableTreeColumn,
		menuDialog
	},
	created() {
		// 获取菜单列表
		this.getMenuLists();
	},
	methods: {
		...mapActions({
			getNewMenuLists: "getMenuLists"
		}),
		async getMenuLists() {
			try {
				this.loading = true
				let { data } = await admin.menuLists();
				this.dataList = treeDataTranslate(data);
				this.loading = false
			} catch (e) {
				this.loading = false
				return e;
			}
		},
		async getAddMenuLists() {
			try {
				let { data } = await admin.addMenuLists();
				this.menuLists = treeDataTranslate(data);
			} catch (e) {
				return e;
			}
		},
		changeType(e) {
			this.typeRadio = e.value;
		},
		changeMenuName(e) {
			this.menuName = e.value;
		},
		nodeClick(e) {
			this.preMenu = e.value;
			this.preMenuId = e.id;
		},
		changeMenuRouter(e) {
			this.menuUrl = e.value;
		},
		changeMenuTag(e) {
			this.menuTag = e.value;
		},
		changeOrder(e) {
			this.orderNum = e.value;
		},
		async addMenu() {
			await this.getAddMenuLists();
			this.title = "新增";
			this.isShow = true;
			this.preMenu = this.menuLists[0].name;
			this.preMenuId = this.menuLists[0].id;
			this.typeRadio = 0;
			this.menuName = "";
			this.menuUrl = "";
			this.orderNum = 0;
			this.menuTag = "";
		},
		closeDialog(e) {
			this.isShow = e.currentShow;
		},
		async addOrUpdateHandle(item) {
			await this.getAddMenuLists();
			this.title = "修改";
			this.id = item.id;
			this.preMenu = item.parentName ? item.parentName : "一级菜单";
			this.preMenuId = item.parentId;
			this.typeRadio = item.type;
			this.menuName = item.name;
			this.menuUrl = item.url;
			this.orderNum = item.orderNum;
			this.menuTag = item.perms;
			this.isShow = true;
			this.getMenuLists();
			// 刷新左侧菜单栏
			this.getNewMenuLists();
		},
		// 新增菜单
		async addNewMenu(e) {
			try {
				await admin.addMenu({
					parentId: e.preMenuId,
					name: e.menuName,
					url: e.menuRouter,
					type: e.typeRadio,
					perms: e.menuTag,
					orderNum: e.num
				});
				this.isShow = false;
				this.getMenuLists();
				// 刷新左侧菜单
				this.getNewMenuLists();
			} catch (e) {
				return e;
			}
		},
		// 修改菜单
		async editMenu(e) {
			try {
				await admin.editMenu({
					id: e.id,
					parentId: e.preMenuId,
					name: e.menuName,
					url: e.menuRouter,
					type: e.typeRadio,
					perms: e.menuTag,
					orderNum: e.num
				});
				this.getMenuLists();
				this.getNewMenuLists();
				this.isShow = false;
			} catch (e) {
					return e;
			}
		},
		// 删除菜单
		async deleteMenu(item) {
			try {
				await admin.deleteMenu({
					id: [item.id]
				});
				this.getMenuLists();
				this.getNewMenuLists();
				this.$message({
					type: "success",
					message: "删除成功!"
				});
			} catch (e) {
				return e;
			}
		},
		// 删除菜单事件
		deleteHandle(item) {
			this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
			.then(() => {
				this.deleteMenu(item);
			})
			.catch(() => {
				this.$message({
					type: "info",
					message: "已取消删除"
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
.menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  .menu-header {
    margin-bottom: 20px;
  }
  .menu-main {
    flex: 1;
    overflow-y: auto;
    .menu-handle-edit {
      color: #409eff;
      cursor: pointer;
    }
    .menu-handle-delete {
      color: #f56c6c;
      cursor: pointer;
    }
  }
}
</style>

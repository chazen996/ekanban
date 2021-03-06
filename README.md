# ekanban
## 基于React的敏捷电子看板（前端部分）
本项目为本人本科毕业设计作品，核心创新点为：支持用户根据实际需求自定义看板结构，并在最大程度上还原物理看板结构，减少用户的学习和维护成本。
本项目**前后端完全分离**，如需正常运行还需和**ekanban-server**（后端部分，采用Java开发）配合使用。

使用到的技术栈为：**React, Ant-Desgin, MobX, React-DnD, React-Router, JavaScript**
[![EMSDMT.md.png](https://s2.ax1x.com/2019/04/27/EMSDMT.md.png)](https://imgchr.com/i/EMSDMT)
### 注册页面
    支持用户自定义上传头像，设置密保问题（用于更改个人密码）
[![EMSIsO.md.png](https://s2.ax1x.com/2019/04/27/EMSIsO.md.png)](https://imgchr.com/i/EMSIsO)
### 看板编辑页面
    1. 用户可通过添加、删除和扩展等操作生成任意的复杂嵌套列结构，并使用鼠标拖拽单元格绘制所需泳道。
    2. 新创建的列和泳道默认为“未命名的xx”，双击可更改相应的列名和泳道名。
    3. 用户可手动设置起始列和终止列，如果不指定，默认最左列为起始列，最右列为终止列，并通过逻辑判断避免了用户的非法操作（如起始列设置在终止列之后，终止列设为为起始列的子列）
    5. 泳道使用淡蓝色进行标识，在用户绘制时实时进行非法校验，即不允许泳道重叠绘制。泳道可合并、拆分、删除。
    6. 为了防止用户误操作，所有的绘制操作在用户点击保存按钮时才一次性同步到后端。未保存直接进入看板使用界面将弹出提示框，询问用户是否舍弃更改。
[![EMSXWt.md.png](https://s2.ax1x.com/2019/04/27/EMSXWt.md.png)](https://imgchr.com/i/EMSXWt)
### 看板使用页面
    1. 用户通过鼠标拖拽卡片完成对task、story、bug的管理，支持全屏、缩放等功能。
    2. 看板操作区域还支持动态自适应窗口大小，增加了不同分辨率下用户的实际使用体验。具体表现为：看板操作区域始终固定在屏幕右下角，并根据屏幕大小调整显示区域
    3. 引入了暂存区的概念（默认隐藏），打通了迭代、看板以及cards(包含task、story等)之间的隔阂，即迭代、看板和cards都属于项目，cards属于迭代，而以看板为
    载体进行呈现。具体到功能上：迭代和看板都能添加cards,新增的cards初始状态都在暂存区中，同一个项目下的所有看板共享同一个暂存区，一旦暂存区中的cards被拖到某个看板中，
    则该card附属当前看板，暂存区中不再显示该card。
    4. 暂存区中显示当前项目下所有已开启的迭代，展开后将显示目标迭代下的cards；暂存区中还将显示当前看板新增的cards；暂存区可隐藏。
    5. card可以通过鼠标拖动移动到合法位置(该位置暂无其他card)，card拖动时，黄色区域为合法位置，红色区域为非法位置。单击card将显示卡片详情，用户可更改卡片
    信息，如认领人、卡片类型、任务详情等信息。
[![EM9GNj.md.png](https://s2.ax1x.com/2019/04/27/EM9GNj.md.png)](https://imgchr.com/i/EM9GNj)
### 其他页面
#### 首页
    首页分为我的项目和我参与的项目。点击项目名称，即可进入项目。
![EM92gx.png](https://s2.ax1x.com/2019/04/27/EM92gx.png)
#### 当前项目页面
    在当前项目页面中，左侧使用tab页分成了迭代和看板两个子页面（参考“看板使用页面：第3点”所述的逻辑）。右侧为固定的项目成员列表，可进行简单的拉人、踢人等操作，
    输入用户的用户名可在数据库中进行模糊查找，默认显示前5个用户。关于权限，任何组内成员均可拉人、踢人，但只有管理员拥有绘制看板的权限，管理员默认为项目创建者，可通过
    权限转让按钮转让项目控制权。
![EM9Rv6.png](https://s2.ax1x.com/2019/04/27/EM9Rv6.png)
#### 迭代管理页面
    迭代采用嵌套列表的方式进行展示和管理，点击加号可展开某个迭代，显示该迭代下所有的cards，并对这些cards进行管理；只有开启的迭代在看板的暂存区中才是可见的。
    在迭代下创建或编辑card逻辑相同，默认创建类型为story，负责人为空，且任务详情为必填选项。card负责人指认范围为当前项目下成员（参考“当前项目页面：成员列表”）
    若勾选上负责人，则在看板使用页面的card上显示负责人的头像。
![EM9fKK.png](https://s2.ax1x.com/2019/04/27/EM9fKK.png)
#### 看板管理页面
    参考“看板使用页面：第3点”所述的逻辑，看板所属项目，负责card的展示，此页面可进行创建、删除、重命名看板等操作。
![EM9hDO.png](https://s2.ax1x.com/2019/04/27/EM9hDO.png)

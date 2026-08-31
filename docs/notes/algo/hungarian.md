# 匈牙利算法

匈牙利算法（**Hungarian algorithm**）

匈牙利算法主要用于解决一些与**二分图匹配**有关的问题，所以我们先来了解一下二分图。

## 二分图简介

**二分图**（**Bipartite graph**）是一类特殊的**图**，它可以被划分为两个部分，每个部分内的点互不相连，下图是典型的二分图。

<img src="https://pic3.zhimg.com/v2-81f21981c992bc0b5b1acf04b37ff6c2_r.jpg" alt="img" style="zoom:50%;" />

可以看到，在上面的二分图中，每条边的端点都分别处于点集X和Y中。匈牙利算法主要用来解决两个问题：求二分图的**[最大匹配数](https://zhida.zhihu.com/search?content_id=109514580&content_type=Article&match_order=1&q=最大匹配数&zhida_source=entity)**和**[最小点覆盖数](https://zhida.zhihu.com/search?content_id=109514580&content_type=Article&match_order=1&q=最小点覆盖数&zhida_source=entity)**。

## 最大匹配问题

<img src="https://pic3.zhimg.com/v2-3d25cee47f59884f46deaea9c7dc95ba_r.jpg" alt="img" style="zoom:67%;" />

现在Boys和Girls分别是两个点集，里面的点分别是男生和女生，边表示他们之间存在“暧昧关系"。最大匹配问题相当于，**假如你是红娘，可以撮合任何一对有暧昧关系的男女，那么你最多能成全多少对情侣**？（数学表述：在二分图中最多能找到多少条没有公共端点的边）

现在我们来看看匈牙利算法是怎么运作的：

我们从B1看起（男女平等，从女生这边看起也是可以的），他与G2有暧昧，那我们就先暂时把他与G2连接（注意这时只是你作为一个红娘在纸上构想，你没有真正行动，此时的安排都是暂时的）

<img src="https://pica.zhimg.com/v2-997b432a51e01b8405275f1b4818f4b8_1440w.jpg" alt="img" style="zoom:67%;" />

来看B2，B2也喜欢G2，这时G2已经“名花有主”了（虽然只是我们设想的），那怎么办呢？我们倒回去看G2目前被安排的男友，是B1，B1有没有别的选项呢？有，G4，G4还没有被安排，那我们就给B1安排上G4。

<img src="https://pic1.zhimg.com/v2-84370dc7e8a5510007c941d35b737c0e_r.jpg" alt="img" style="zoom:50%;" />

然后B3，B3直接配上G1就好了，这没什么问题。至于B4，他只钟情于G4，G4目前配的是B1。B1除了G4还可以选G2，但是呢，如果B1选了G2，G2的原配B2就没得选了。我们绕了一大圈，发现B4只能注定单身了，可怜。（其实从来没被考虑过的G3更可怜）

<img src="https://pica.zhimg.com/v2-634b61583dddfbae732af01110bce632_r.jpg" alt="img" style="zoom:50%;" />

## 代码实现

```cpp
int M, N;            //M, N分别表示左、右侧集合的元素数量
int Map[MAXM][MAXN]; //邻接矩阵存图
int p[MAXN];         //记录当前右侧元素所对应的左侧元素
bool vis[MAXN];      //记录右侧元素是否已被访问过
bool match(int i)
{
    for (int j = 1; j <= N; ++j)
        if (Map[i][j] && !vis[j]) //有边且未访问
        {
            vis[j] = true;                 //记录状态为访问过
            if (p[j] == 0 || match(p[j])) //如果暂无匹配，或者原来匹配的左侧元素可以找到新的匹配
            {
                p[j] = i;    //当前左侧元素成为当前右侧元素的新匹配
                return true; //返回匹配成功
            }
        }
    return false; //循环结束，仍未找到匹配，返回匹配失败
}
int Hungarian()
{
    int cnt = 0;
    for (int i = 1; i <= M; ++i)
    {
        memset(vis, 0, sizeof(vis)); //重置vis数组
        if (match(i))
            cnt++;
    }
    return cnt;
}
```

### 完整代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N=5e2+5,M=5e4+5;
int e[M],ne[M],h[N],idx;
int mate[N],st[N];

void add(int a,int b) {
    e[idx]=b,ne[idx]=h[a],h[a]=idx++;
}

bool HA(int u) { //Hungarian Algorithm
    for(int i=h[u]; i!=-1; i=ne[i]) {
        int j=e[i];
        if(!st[j]) {
            st[j]=true;
            if(!mate[j] || HA(mate[j])) {
                mate[j]=u;
                return true;
            }
        }
    }
    return false;
}

int main() {
    memset(h,-1,sizeof h);
    int n,m,e;
    cin>>n>>m>>e;
    while(e--) {
        int u,v;
        cin>>u>>v;
        add(u,v);
    }

    int cnt=0;
    for(int i=1; i<=n; i++) {
        memset(st,false,sizeof st);
        if(HA(i)) cnt++;
    }
    cout<<cnt<<endl;

    return 0;
}

/*
in:
4 2 7
3 1
1 2
3 2
1 1
4 2
4 1
1 1

out:
2
*/
```

## 最小点覆盖问题

我们想找到**最少**的一些**点**，使二分图所有的边都**至少有一个端点**在这些点之中。倒过来说就是，删除包含这些点的边，可以删掉所有边。

**（[König定理](https://zhida.zhihu.com/search?content_id=109514580&content_type=Article&match_order=1&q=König定理&zhida_source=entity)）**

> 一个二分图中的最大匹配数**等于**这个图中的最小点覆盖数。

对于König定理的证明，见 [König定理](./基础知识/König定理)

## 例题

例题1.矩阵游戏     [P1129 [ZJOI2007\] 矩阵游戏 - 洛谷](https://www.luogu.com.cn/problem/P1129)

例题2.CoVH之柯南开锁   [CoVH之柯南开锁 - Vijos](https://vijos.org/p/1204)

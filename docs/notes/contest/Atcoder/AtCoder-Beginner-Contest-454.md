# AtCoder Beginner Contest 454

> 问题总结：同样的问题，第三题开始卡壳了，实则是对图论DFS的不自信。。。

## C

### 题目描述

![image-20260419111755639](/images/image-20260419111755639.png)

### 分析

理解过来，其实就是一个连环的问题，从1开始，只要不断，就不断以它的终点作为新的起点，然后一直延伸，看看最终能有几个结点是能连接到的，累加，最后输出

其实一开始我有想过直接图论DFS去搜，但因为我不熟练，不太会，所以就没有尝试，反倒用map不断试，最终只A了6个点。。。

趁此机会加深一下对DFS的理解，因为题目中会给出起点至终点，然后需要找出连环串，这时因为要考虑的是点的数量，所以可以整一个v数组标记，最后遍历一下数组就OK了，算法过程可以参考连通块模型，只要该点没走过，就直接DFS遍历

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<vector>
#include<algorithm>
#include<cmath>
#include<climits>
#include<vector>
#include<map>
#include<queue>
#define int long long
using namespace std;
const int N=3e5+2;
struct node{
	int v,next;
}edge[N];
int cnt=0,head[N],v[N];
void add(int u,int v){
	edge[++cnt].v=v;
	edge[cnt].next=head[u];
	head[u]=cnt;
}
void dfs(int now){
	if(v[now]) return ;
	v[now]=1;
	for(int i=head[now];i;i=edge[i].next){
		int y=edge[i].v;
		if(!v[y]) dfs(y);
	}
}
signed main(){
	int n,m;
	int ans=0;
	std::cin>>n>>m;
	int x,y;
	for(int i=1;i<=m;i++){
		std::cin>>x>>y;
		add(x,y);
	}
	dfs(1);
	for(int i=1;i<=n;i++) if(v[i]) ans++;
	std::cout<<ans;
	return 0;
}
```

> 对于连通块模型可以复习一下笔记！



## D

> 说白了，有些时候C题卡壳了可以去看看D题，不要想象说他肯定很难，其实有些时候挺简单的，就像这道题

### 题目描述

![image-20260419113032582](/images/image-20260419113032582.png)

### 分析

可以知道，这道题其实就是将(xx)换为xx，或者xx换为(xx)，然后看看两个字符串可不可以经过变换最终相等，其实理解下来，本质可以直接去括号，因为加括号和去括号是一个对立的操作，你只需要看一个能不能变换为另一个就行了，没必要考虑两种，所以只需要两个都把能去的括号给删了，看看最终相不相等即可

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<vector>
#include<algorithm>
#include<cmath>
#include<climits>
#include<vector>
#include<map>
#include<queue>
using namespace std;
const int N=2e6+10;
int T;
int n,m,top;
char st[N];
int main(){
    string a,b,s,t;
    std::cin>>T;
    while(T--){
        std::cin>>a>>b;
        n=a.size(),m=b.size();
        a=" "+a,b=" "+b;
        s=" ",t=" ";
        top=0;
        for(int i=1;i<=n;i++){
            st[++top]=a[i];
            if(top>=4){
                if(st[top-3]=='('&&st[top-2]=='x'&&st[top-1]=='x'&&st[top]==')'){
                    top-=4;
                    st[++top]='x';
                    st[++top]='x';
                }
            }
        }
        for(int i=1;i<=top;i++) s+=st[i];
        top=0;
        for(int i=1;i<=m;i++){
            st[++top]=b[i];
            if(top>=4){
                if(st[top-3]=='('&&st[top-2]=='x'&&st[top-1]=='x'&&st[top]==')'){
                    top-=4;
                    st[++top]='x';
                    st[++top]='x';
                }
            }
        }
        for(int i=1;i<=top;i++) t+=st[i];
        if(s==t) std::cout<<"Yes"<<'\n';
        else std::cout<<"No"<<'\n';
    }
    return 0;
}
```


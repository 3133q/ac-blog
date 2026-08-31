# 逆向思维

> 正向推导即为模拟思想，但有些题模拟做就是会超时，这时考虑考虑逆向思维

## 1.[D - Placing Rooks](https://atcoder.jp/contests/abc466/tasks/abc466_d)

### 问题描述

![image-20260711212942620](/images/image-20260711212942620.png)

### 分析

本质上就是说，有m次操作，每次操作给出ri，ci，要求把第ri行上的所有棋子清空，然后把ci列上的所有棋子清空，然后再把该棋子放在(ri,ci)位置上

这道题如果正向推导，即完全模拟，就是按照放棋子之前，遍历一下该行所有棋子，以及该列所有棋子，然后进行--操作，但很明显，这种方法的时间复杂度会达到O(n^2)，一下就会超时，所以正向完全不行，这时，不妨想想逆向推导

一个棋子，他要是想最后还在这个棋盘上，那他就必须在后面的操作里不被清除，这样才能保证它最终贡献1，所以我们可以从后往前遍历，然后一个个存储下来，然后比对，直接反向推出答案。

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cmath>
#include<vector>
#include<map>
#include<unordered_set>
#include<queue>
#include<algorithm>
#include<climits>
#define int long long
using namespace std;
signed main(){
	int n,m;
	std::cin>>n>>m;
	vector<int>r(m+1),c(m+1);
	for(int i=1;i<=m;i++) std::cin>>r[i]>>c[i];
	unordered_set<int>row;
	unordered_set<int>col;
	int sum=0;
	for(int i=m;i>=1;i--){
		int rr=r[i];
		int cc=c[i];
		if(row.find(rr)==row.end()&&col.find(cc)==col.end()) sum++;
		row.insert(rr);
		col.insert(cc);
	}
	std::cout<<sum;
	return 0;
}
```


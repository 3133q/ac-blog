# AtCoder Beginner Contest 465

## **C - Reverse Permutation**

### 1.题目描述

<img src="/images/image-20260706085824414.png" alt="image-20260706085824414" style="zoom:80%;" />

翻译过来就是说，一个字符串S，从前往后扫一遍，如果是o，那就翻转从当前字符到最初那个字符之间的字符串，如果是x，那就不动，然后输出最终字符对应的数字序列

### 2.题目分析

可以知道，要是正向去推的话，那么很难知道一个字符经过多轮翻转后会到哪个位置，所以说 我们需要反向去解这道题，从后往前去扫，可以发现一个规律

如果是 ooxoo

对应1 2 3 4 5

翻转过程：1 2 3 4 5 -&gt; 1 2 3 4 5 -&gt; 2 1 3 4 5 -&gt; 2 1 3 4 5 -&gt; 4 3 1 2 5 -&gt; 5 2 1 3 4

可以知道，最后一个数字只与最后一个字符是o或x有关，然后倒数第二个只跟最后一个字符有关，就取决于最后转还是不转，所以可以这么来，交替填数，最后面肯定先按是否为o，决定填哪，那就整一个双指针，通过--r去填，然后这个填完打个标记，往前一个的时候根据标记决定把整体反过来填，就是从l开始，这样以此类推。。。

### 3.代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=5e5+10;
int a[N];
signed main(){
	int n;
	string s;
	std::cin>>n;
	std::cin>>s;
	s=" "+s;
	int f=1,l=0,r=n+1;
	for(int i=n;i>=1;i--){
		if(f){
			if(s[i]=='o') {
			    a[++l]=i;
			    f=0;
			}
			else a[--r]=i;
		}
		else{
			if(s[i]=='o') {
				a[--r]=i;
				f=1;
			}
			else a[++l]=i;
		}
	}
	for(int i=1;i<=n;i++) std::cout<<a[i]<<" ";
	return 0;
}
```

---

## **D - X to Y**

### 1.题目描述

![image-20260706094507868](/images/image-20260706094507868.png)

### 2.题目分析

分析过来就是对于x，k，每次可以变成 x/k 或者 [x * k, x * k+k-1]，然后问最少经过几轮可以让x变成y

其实认真研究一下就可以发现这题本质上就是因数的问题，只要x和y最后除出来结果变成同一个数，那么就可以转换成功了，相当于最近公共祖先（LCA）问题

### 3.代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=5e5+10;
int a[N];
void solve(){
	int x,y,k;
	std::cin>>x>>y>>k;
	vector<int>fx,fy;
	int tot=x;
	while(tot>0){
		fx.push_back(tot);
		tot/=k;
	}
	tot=y;
	while(tot>0){
		fy.push_back(tot);
		tot/=k;
	}
	int l1=fx.size()-1,l2=fy.size()-1;
	while(l1>=0&&l2>=0&&fx[l1]==fy[l2]){
		l1--;
		l2--;
	}
	std::cout<<(l1+1)+(l2+1)<<'\n';
	return ;
}
signed main(){
	int t;
	std::cin>>t;
	for(int i=0;i<t;i++) solve();
	return 0;
}
```


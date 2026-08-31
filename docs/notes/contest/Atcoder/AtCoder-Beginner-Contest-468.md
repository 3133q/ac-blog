# [AtCoder Beginner Contest 468](https://atcoder.jp/contests/abc468)

> 再度验证了中心扩展法在回文系列的重要性！

## D

### 1.题目描述

![image-20260726134010708](/images/image-20260726134010708.png)

### 2.分析

题目理解过来就是说，首先定义好字符串是能够通过修改至多一个字符使该字符串变成回文子串的字符串，然后现在要求字符串S有多少个子串是好字符串

这道题如果用别的方法做，可能会非常不方便，因为判断是否是好字符串，我们需要去遍历看看当前字符串有几个字符是不满足相等的，然后做个计数，只要最终&lt;=1，即可

但如果直接双指针全部扫一遍，既麻烦，又复杂，这里就得使用中心扩展法，也就是对于一个字符串，以中心为轴，向两边扩散，一组组比较，然后判断回文性

这道题也是一样，我们可以枚举奇数长度的字符串和偶数长度的，奇数的话，就是以i为中心，枚举半径r，i+r，i-r即为一组，然后去扫一遍，记个数，对于偶数长度的话，相当于以中间两个为轴，i和i+1，那么判断就是i-r，i+1+r，然后一个个判断

### 代码

```c++
#include<bits/stdc++.h>
#define int long long 
using namespace std;
string s;
signed main(){
	std::cin>>s;
	int l=s.size();
	int sum=0;
	for(int i=0;i<l;i++){
		int t=0;
		for(int r=0;i-r>=0&&i+r<l;r++){
			if(s[i-r]!=s[i+r]) t++;
			if(t<=1) sum++;
			else break;
		}
	}
	for(int i=0;i<l-1;i++){
		int t=0;
		for(int r=0;i-r>=0&&i+1+r<l;r++){
			if(s[i-r]!=s[i+1+r]) t++;
			if(t<=1) sum++;
			else break;
		}
	}
	std::cout<<sum;
	return 0;
}
```



## 扩展

### 中心扩展法+动态规划

> 在求解最长回文子串的题目时，我们往往需要用到一点手段，才能很好的求出来

#### 中心扩展法

相当于以一个点为中心，向两边扩散，比如对于奇数长度，那就直接中心一个点，标一个l和r（l=r），然后只要两边的字符相同，那就l--，r++，以此推出最终的长度，对于偶数的话，那就标定中间两个为中心，分别向两边扩散，l--，r++

##### 代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
string s;
int ll;
int len1(int l,int r){
	while(l>=0&&r<ll&&s[l]==s[r]){
		l--,r++;
	}
	return r-l-1;
}
int len2(int l,int r){
	while(l>=0&&r<ll&&s[l]==s[r]){
		l--,r++;
	}
	return r-l-1;
}
signed main(){
	std::cin>>ll; 
	std::cin>>s;
	int maxx=-1e18;
	for(int i=0;i<ll;i++){
		int l1=len1(i,i);
		int l2=len2(i,i+1);
		maxx=max({maxx,l1,l2});
	}
	std::cout<<maxx;
	return 0;
}
```

> 注意这里的长度是(r-1)-(l+1)+1=r-l-1！！！

---

#### 动态规划

核心在于转移，我们假设dp[i] [j]表示i到j这一段是不是回文子串，然后拿这个去推导

状态转移方程：
$$
dp[i][j]=(s[i]==s[j])\&\&(dp[i+1][j-1])
$$
然后去一个个推。。

注意，这里要全部推完，不能走到一半退出，因为这里的新状态依附于旧状态

##### 代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
string s;
int ll;
int dp[5001][5001];
signed main(){
	std::cin>>ll; 
	std::cin>>s;
	int maxx=-1e18;
	for(int i=0;i<ll;i++) dp[i][i]=1;
	for(int l=2;l<=ll;l++){
		for(int i=0;i<ll;i++){
			int j=i+l-1;
			if(j>=ll) break;
			if(s[i]!=s[j]) dp[i][j]=0;
			else{
				if(l==2) dp[i][j]=1;
				else dp[i][j]=dp[i+1][j-1];
			}
			if(dp[i][j]&&l>maxx){
				maxx=l;
			}
		}
	}
	std::cout<<maxx;
	return 0;
}
```


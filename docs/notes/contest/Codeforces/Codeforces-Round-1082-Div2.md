# Codeforces Round 1082 Div2

> 总结：新思路，新方法！！！

## B

[Problem - B - Codeforces](https://codeforces.com/contest/2202/problem/B)

### 题目描述

<img src="/images/image-20260327175029165.png" alt="image-20260327175029165" style="zoom:80%;" />

翻译过来就是，先给出一个序列T，在奇数的位置上是a，在偶数的位置上是b，例如aba，abab.......，进行每次操作的时候，可以选择拿走开头的那个字母，也可以是结尾的那个字母，每次操作拿出字母然后汇总组成一个新的字符串S，这就是对应的操作方法，现在题目要我们处理的就是给出一串字符串可能包含？，对于？可以是a也可以是b，要我们判断这个字符串是否可以通过上面的操作方法给凑出来，可以则YES，否则NO

### 分析

这道题本质上是判断YES和NO，对于这种问题，得习惯找规律，像这题，我们就需要仔细观察发现其中的奥秘，因为初始的字符串T是ababab......这样的类型，虽说你能从开头或者末尾拿字母，但是有个地方是恒定的，下面我们先从例子分析！

对于aba

-&gt; aba  aab

对于ababa

-&gt; aabab  aabba  abaab  ababa

其实可以这么想，相邻的两个字符可能来自一个首一个尾，所以说硬分析相邻两个字母显得很难，那如果我们跳着，看相隔的字符呢？？？

对于n为奇数的情况，因为一开始两端的值相同，所以得跳过第一位（下标为0），来到第一位，可以知道，选了一端之后，不管你之后选啥，肯定跟a不同，就是b，类似的，跳一位，接着判断，可以确定它和它的下一位肯定也不同，这样就找着它的规律了！！！

对与偶数的话，例如abab

-&gt; abba  abab  baab  baba

一开始两端的值不同，所以我们可以从第一位开始判断，使用同样的方法，跳一位，可以发现一样的适用，当前位与下一位一定不同！！！

那这样直接上代码吧。。。

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<climits>
#define int long long
using namespace std;
void solve(){
	int n;
	std::cin>>n;
	string s;
	std::cin>>s;
	if(n&1){
		if(s[0]=='b'){
			std::cout<<"NO"<<'\n';
			return ;
		}
		for(int i=1;i<=n-2;i+=2){
			if(s[i+1]!=s[i]||s[i]=='?'||s[i+1]=='?') continue;
			else{
				std::cout<<"NO"<<'\n';
				return ;
			}
		}
		std::cout<<"YES"<<'\n';
		return ;
	}
	else{
		for(int i=0;i<=n-2;i+=2){
			if(s[i]!=s[i+1]||s[i]=='?'||s[i+1]=='?') continue;
			else{
				std::cout<<"NO"<<'\n';
				return ;
			}
		}
		std::cout<<"YES"<<'\n';
		return ;
	}
}
signed main(){
	int t;
	std::cin>>t;
	for(int i=0;i<t;i++) solve();
	return 0;
}
```

### dp方法

这种办法直接推规律是相对更简单，简洁的写法，当然，这道题也有大神用dp去写，也就是说探索由初始的T例如ababa这样的去看看他可以构成怎么样的字符串，然后dp去推导，看看代码理解理解吧

### 代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=1e6+2;
int n,a[N];
string s;
int dp[N][2][2];
void solve(){
    std::cin>>n>>s;
    memset(dp,0,sizeof(dp));
    if(n%2==1) dp[0][0][0]=1;
    else dp[0][0][1]=1;
    for(int i=0;i<n;i++){
        for(int hd=0;hd<2;hd++){
            for(int tl=0;tl<2;tl++){ 
                if(dp[i][hd][tl]==0) continue;
                if(s[i]=='?') dp[i+1][1-hd][tl]=dp[i+1][hd][1-tl]=1;
                else{
                    int t=s[i]-'a';
                    if(hd==t) dp[i+1][1-hd][tl]=1;
                    else if(tl==t) dp[i+1][hd][1-tl]=1;
                }
            }
        }
    }
    if(dp[n][0][1]||dp[n][1][0]) cout<<"YES"<<'\n';
    else cout<<"NO"<<'\n';
}
signed main(){
    int t;
	std::cin>>t;
    while(t--) solve();
    return 0;
}
```

---

## C

[Problem - C1 - Codeforces](https://codeforces.com/contest/2202/problem/C1)

> 前言，这道题跟曾经一道题的思路很相似

追溯

### 题目描述

<img src="/images/image-20260327181508529.png" alt="image-20260327181508529" style="zoom:80%;" />

翻译过来，就是说假设一开始有一个序列，初始有几个值，然后你可以随便选择一个数，在它的后面插入这个值加一，也就是ai后面插入ai+1，问最少这个初始序列要多少个元素，才能最终得到目标序列

### 分析

这道题按传统的分析就是看看某个数往后延续的差值为1的序列能有多长，在这区间的直接continue，否则就是新的一个数需要出现，但如果这样做会发现最后一个样例结果对不上，仔细分析才发现问题。。。

```
9
9 8 9 2 3 4 4 5 3
```

对于这组，结果输出是3，但如果单纯看延续的加一序列，会发现最后一个3会加入计数，结果会出现4，对不上

后面我才发现题目的意思在于只要找到一个小于该值的数，就可以在它后边插，所以这个答案是3

### 思路

对于这种需要往前匹配的题目，就好似括号匹配问题（采用栈解决），都可以套用一种方法，就是top二剑客！

看看代码你就明白了！

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<climits>
#include<cmath>
#include<map>
#include<stack>
#define int long long
using namespace std;
const int N=1e6+2;
int a[N],st[N];
void solve(){
	int n;  
	std::cin>>n;
	for(int i=1;i<=n;i++) std::cin>>a[i];
	int top=0;
	for(int i=n;i>=1;i--){
		while(top&&a[i]+1==st[top]) top--;
		st[++top]=a[i];
	}
	std::cout<<top<<'\n';
	return ;
}
signed main(){
	int t;
	std::cin>>t;
	for(int i=0;i<t;i++) solve();
	return 0;
}
```

想举一反三去看看回溯！

# kmp算法

kmp算法主要是用来解决字符串匹配问题，摒弃传统的暴力匹配的方法，缩减时间复杂度，高效寻找

## 暴力解法

首先介绍传统算法----

例如给出两个字符串     abaccaba      cca

要找出s1中是否能找出s2，如果能，返回首字母出现的位置

```c++
int j;
int l1=s1.length();
int l2=s2.length();
for(int i=0;i<l1-l2;i++){
    for(j=0;j<l2;j++){
        if(s1[i+j]!=s2[j]) break;
    }
    if(j==l2-1) int pos=i;
}
```

这种传统的方法最坏情况就是正好在尾端才能匹配成功，那样时间复杂度会高达O(n*n)。。。。。

## 正题

引入kmp算法，核心在于在匹配失败后不是直接返回开头重新寻找，而是跳转到另一个可能匹配成功的地方，继续搜索，利用pmt数组储存，接下来讲述pmt数组如何起效

举个例子吧   abbcabda         abda

先对主字符串分析吧  abbcabda ，假如说ab我都匹配上了，但是下一位b没有匹配成功，那该如何走呢？答案是寻找可能正确的位置，比如说相对应的后面的ab，这时如果能直接跳到那个位置，再进行匹配，发现就成功了，abda  这样，对于pmt数组的用武之地想必就清楚了吧，接下来看看如何计算

### PMT 数组的计算

abbcabda    本质是求从该位置往后k个字符和开头k个字符相匹配，k的最大值，简单说，就是比开头和结尾，共几个相匹配的

第一个a，自然是0，下一个b，再下一个b，c也都是0，直到a出现，可以知道前面正好有一个a，因此该位置的pmt值为1，再往后，b能匹配，加1，为2，d未能找到，为了快些，直接跳到pmt[j-1]，最后得出0，最后一个a结果是1

即为0 0 0 0 1 2 0 1

代码实现---

```c++
// pmt[0] = 0;
for (int i = 1, j = 0; i < plen; ++i){
    while (j && p[i] != p[j]) j = pmt[j - 1];
    if (p[i] == p[j]) j++;
    pmt[i] = j;
}
```

### 匹配过程

有了pmt数组，后面就好匹配了，直接上代码

```c++
void kmp(const string& s1,const string& s2){
	int l1=s1.length(),l2=s2.length();
	for(int i=0,j=0;i<l1;i++){
		while(j&&s1[i]!=s2[j]) j=pmt[j-1];
		if(s1[i]==s2[j]) j++;
		if(j==l2){
			std::cout<<i-j+2<<'\n';
			j=pmt[j-1];
		}
	}
}
```

### 完整代码

最后，整体模板题的源代码：

[P3375 【模板】KMP - 洛谷](https://www.luogu.com.cn/problem/P3375)

```c++
#include<iostream>
#include<string>
using namespace std;
const int N=1e6+2;
int pmt[N];
void get_pmt(const string& s){
	pmt[0]=0;
	int l=s.length();
	for(int i=1,j=0;i<l;i++){
		while(j&&s[i]!=s[j]) j=pmt[j-1];
		if(s[i]==s[j]) j++;
		pmt[i]=j;
	}
}
void kmp(const string& s1,const string& s2){
	int l1=s1.length(),l2=s2.length();
	for(int i=0,j=0;i<l1;i++){
		while(j&&s1[i]!=s2[j]) j=pmt[j-1];
		if(s1[i]==s2[j]) j++;
		if(j==l2){
			std::cout<<i-j+2<<'\n';
			j=pmt[j-1];
		}
	}
}
int main(){
	string s1,s2;
	std::cin>>s1>>s2;
	get_pmt(s2);
	kmp(s1,s2);
	for(int i=0;i<s2.length();i++){
		std::cout<<pmt[i]<<" ";
	}
	return 0;
}
```

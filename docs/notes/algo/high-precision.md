# 高精度算法

从乘法引入高精度吧，在处理大数相乘，或者题目恶心在阶乘题里边把数据范围扩大到1~10000，这时单纯用普通的计算方法显得很白痴，而且一无是处，这时，就该拿出我们的高精度了！

比如对于很大很大的数字乘，结果甚至大出了long long的数据范围限制，所以高精度必不可免，下面让我们先从高精度乘法开始说起吧

## 高精度乘法

高精度其实就是列竖式，把我们数学中的列竖式用代码实现了而已，其实核心思路很简单的--把数字先转为字符串，然后从后往前存到数组里，然后一位一位乘，类似数学乘法，其间考虑进位问题即可，直接看代码吧

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	int a,b,a1[100001],b1[100001],c[200001];
	std::cin>>a>>b;
	string s1=to_string(a);
	string s2=to_string(b);
	int total=0;
	for(int i=s1.size()-1;i>=0;i--) a1[total++]=s1[i]-'0';
	total=0;
	for(int i=s2.size()-1;i>=0;i--) b1[total++]=s2[i]-'0';
	int cnt=max(s1.size(),s2.size());
	for(int i=0;i<cnt;i++){
		for(int j=0;j<cnt;j++){
			c[i+j]+=a1[i]*b1[j];
			c[i+j+1]+=c[i+j]/10;
			c[i+j]%=10;
		}
	}
	int s=s1.size()+s2.size();
	while(s>=0&&c[s-1]==0) s--;
	for(int i=s-1;i>=0;i--) std::cout<<c[i];
	return 0;
}
```

注意的是，前边cnt取二者长度最大值是为了补0，方便作乘法，然后最后记得两数相乘的最大位数就是二者的位数之和，所以定s，然后除前导0，最后输出结果。

## 例题：高精度阶乘

理解了高精度乘法的思维，下面开始说说阶乘问题了。

[U302256 求10000以内n的阶乘 - 洛谷](https://www.luogu.com.cn/problem/U302256)

先掏个计算器按一下

1！=1

2！=2

3！=6 .........

8！=40320

9！=362880 .........

15！=1,307,674,368,000

其实可以发现只到15就已经非常大了，更别说10000了，long long怎么可能行，高精度思路走起

这里采取的是进制位，因为8开始阶乘就已经过万了，所以我们可以以10000为进制位，也就是数组每一个数以10000为单位，也就是4位数，然后从1到目标数，一个个乘储存的大数的每一位，然后该进就进，相当于竖式乘法一样。

上代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
void fac(int n){    //10000进制数组
    int a[10002];
    int digital=1,carry=0;
    a[1]=1;
    if(!n) printf("1");
    else{
        for(int i=1;i<=n;i++){
            carry=0;
            for(int j=1;j<=digital;j++){
                a[j]=a[j]*i+carry;
                carry=a[j]/10000;
                a[j]%=10000;
            }
            if(carry) a[++digital]=carry;
        }
        cout<<a[digital];
        for(int k=digital-1;k>0;k--)
            printf("%04d",a[k]);
    }
    std::cout<<'\n';
}
int main(){
    //std::ios::sync_with_stdio(false);
    //std::cin.tie(0);
    int n;
    while(scanf("%d",&n) == 1){
        fac(n);
    }
    return 0;
}
```

最后的%04d其实是为了控制4位宽度，因为每10000进一位，%10000后剩下的就是4位数，先输出a[digital]是因为不确定carry最后进的位是否是4位数，所以直接输出就好

### 另一种写法

还有一种写法可以参考

```cpp
#include <iostream>
using namespace std;
int num[105] = {0}, ans[205] = {0}; //习惯初始化为0，其实全局变量会自动初始化为0
int main(){
	int n, temp = 0, digit = 0;
	cin >> n;
	num[105] = ans[105] = 1;
	for(int i = 2; i <= n; i++){ //控制循环层数，也就是阶乘数 
		for(int j = 105; j >= 0; j--){//高精度乘法，直接正存，105位够了 
			num[j] = num[j] * i + temp;
			temp = num[j] / 10; //直接取需要进位的数
			num[j] = num[j] % 10; //进位后剩下最后一个个位数  
		}
		temp = 0; 
		for(int j = 105; j >= 0; j--){//高精度加法，阶乘数相加 
			ans[j] += num[j] + temp;
			temp = ans[j] / 10;
			ans[j] = ans[j] % 10;
		}
	}
	//输出的处理 
	for(int j = 0; j <= 105; j++){//直接算出非零到哪一位 
			if(ans[j] != 0){
				digit = j;
				break;
			}
	}
	for(int i = digit; i <= 105; i++){
		cout << ans[i];
	}
	return 0;
}
```

## 高精度加法

下面开始讲高精度加法和减法

加法减法其实相较于乘法更简单，高精度本质是竖式，加法减法只要考虑个进位就行，先说加法吧

从代码起步：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	int a,b,a1[100001],b1[100001],c[200001];
	std::cin>>a>>b;
	string s1=to_string(a);
	string s2=to_string(b);
	int total=0;
	for(int i=s1.size()-1;i>=0;i--) a1[total++]=s1[i]-'0';
	total=0;
	for(int i=s2.size()-1;i>=0;i--) b1[total++]=s2[i]-'0';
	int cnt=max(s1.size(),s2.size());
	for(int i=0;i<cnt;i++){
		a1[i]+=b1[i];
		if(i==cnt-1&&a1[i]>=10) break;
		a1[i+1]+=a1[i]/10;
		a1[i]%=10;
	}
	for(int i=cnt-1;i>=0;i--) std::cout<<a1[i];
	return 0;
}
```

注意点：得取两数位数更多的作为for循环的终点（也是补0原则），然后注意最后一位要是满10了直接退出就行，不需要进一步进位了

## 高精度减法

下一个说减法，其实减法有个坑，就是得考虑负数的情况，所以开头来个判断，如果是负数的话反过来赋值，也就是用来作被减数的数组赋值更大的那个数，然后正常减就行，考虑进位即可

看代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
int a[30001],b[30001];
char s1[3001],s2[3001];
int max(int a,int b){
	return a>b?a:b;
}
int main(){
	bool flag=0;
	cin>>s1>>s2;
	int k=0;
	int l1=strlen(s1),l2=strlen(s2);
	if(l1<l2||strcmp(s1,s2)<0&&l1==l2){
		flag=1;
		for(int i=l2-1;i>=0;i--) a[k++]=s2[i]-'0';
		k=0;
		for(int i=l1-1;i>=0;i--) b[k++]=s1[i]-'0';
	}
	else {
		k=0;
		for(int i=l1-1;i>=0;i--) a[k++]=s1[i]-'0';
		k=0;
		for(int i=l2-1;i>=0;i--) b[k++]=s2[i]-'0';
	}
	int cnt=max(l1,l2);
	for(int i=0;i<cnt;i++){
		a[i]=a[i]-b[i];
		if(a[i]<0){
			a[i+1]--;
			a[i]+=10;
		}
	}
	while(a[cnt-1]==0&&cnt>=0){
		cnt--;
	}
	if(flag==1) printf("-");
	for(int i=cnt-1;i>=0;i--) printf("%d",a[i]);
	return 0;
}
```

## 高精度除法

高精度除法（其实本质上也是竖式，理解一下即可）

```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100001],r[100001];
long long yu;
int main(){
	string s1,s2;
	std::cin>>s1>>s2;
	if(s1.size()<s2.size()||s1.size()==s2.size()&&s1<s2||s1=="0") {
		std::cout<<0;
		return 0;
	}
	long long b=stoi(s2);
	int total=0;
	for(int i=s1.size()-1;i>=0;i--) a[total++]=s1[i]-'0';
	for(int i=s1.size()-1;i>=0;i--){
		yu=yu*10+a[i];
		r[i]=yu/b;
		yu%=b;
	}
	int tmp=s1.size();
	while(tmp>0&&r[tmp-1]==0) tmp--;
	for(int i=tmp-1;i>=0;i--) std::cout<<r[i];
	return 0;
}
```

[]()

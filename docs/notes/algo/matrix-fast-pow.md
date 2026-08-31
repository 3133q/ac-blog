# 矩阵快速幂

## 引入：快速幂算法

为了解决a的b次方，若用普通的pow函数，数据大了会很慢，且容易错误

让我们先来思考一个问题：**7的10次方，怎样算比较快？**

**方法1：**最朴素的想法，7*7=49，49*7=343，... 一步一步算，共进行了**9次**乘法。

这样算无疑太慢了，尤其对计算机的CPU而言，每次运算只乘上一个个位数，无疑太屈才了。这时我们想到，也许可以拆分问题。

**方法2：**先算7的5次方，即7*7*7*7*7，再算它的平方，共进行了**5次**乘法。

但这并不是最优解，因为对于“7的5次方”，我们仍然可以拆分问题。

**方法3：**先算7*7得49，则7的5次方为49*49*7，再算它的平方，共进行了**4次**乘法。

模仿这样的过程，我们得到一个在O(logn)时间内计算出幂的算法，也就是快速幂。

递归实现：![](/images/matrix-31.png)

代码实现：

```cpp
//递归快速幂（对大素数取模）
#define MOD 1000000007
typedef long long ll;
ll qpow(ll a, ll n)
{
    if (n == 0)
        return 1;
    else if (n % 2 == 1)
        return qpow(a, n - 1) * a % MOD;
    else
    {
        ll temp = qpow(a, n / 2) % MOD;
        return temp * temp % MOD;
    }
}
```

但是递归毕竟太慢，容易超时，故采取非递归

代码：

```cpp
//非递归快速幂
int qpow(int a, int n){
    int ans = 1;
    while(n){
        if(n&1)        //如果n的当前末位为1
            ans *= a;  //ans乘上当前的a
        a *= a;        //a自乘
        n >>= 1;       //n往右移一位
    }
    return ans;
}
```

![img](https://pic3.zhimg.com/v2-e99e321dcff33699093cde2876424dbe_r.jpg)

类似这样。。。。。

## 矩阵快速幂

接下来，讨论快速幂的升级版--矩阵快速幂

实则就是将快速幂函数内的base换为一个单位矩阵，将数与数的乘积变化为矩阵和矩阵之间的乘积，以斐波那契数列为例

这么想   数列满足F(n)=F(n-1)+F(n-2)

假设矩阵[F(n),F(n-1)]=[F(n-1),F(n-2)]* ![](/images/matrix-32.png)

容易解得 a=1,b=1,c=1,d=0;

<img src="/images/matrix-33.png" style="zoom:75%;" />

这里使用二维数组d[2] [2]定义矩阵，并在struct中重载乘法运算；快速幂算法采取非递归快速幂。

### 代码实现

```cpp
#include<bits/stdc++.h>
using namespace std;

typedef long long lint;

lint m, n;

struct Matrix {
    lint d[2][2];

    Matrix() {
        memset(d, 0, sizeof(d));
    }

    Matrix operator* (const Matrix& x) {
        Matrix ans;
        for (int i = 0; i <= 1; ++i) {
            for (int j = 0; j <= 1; ++j) {
                for (int k = 0; k <= 1; ++k) {
                    ans.d[i][j] += (d[i][k] * x.d[k][j]) % m;
                }
                ans.d[i][j] = (((ans.d[i][j] % m) + m) % m);
            }
        }
        return ans;
    }
};

Matrix fpow(Matrix a, lint n) {
    Matrix ans;
    ans.d[0][0] = ans.d[1][1] = 1;//初始化
    while (n) {
        if (n & 1) {
            ans = ans * a;
        }
        a = a * a;
        n >>= 1;
    }
    return ans;
}

int main() {
    cin >> m >> n;
    if (n == 1) {
        cout << 1 << endl;
        return 0;
    } else if (n == 2) {
        cout << 1 << endl;
        return 0;
    }
    Matrix a;
    a.d[0][0] = 1;
    a.d[0][1] = 1;

    Matrix c;
    c.d[0][0] = 1;
    c.d[0][1] = 1;
    c.d[1][0] = 1;
    c = fpow(c, n - 2);
    a = a * c;
    cout << a.d[0][0] << endl;

    return 0;
}
```

## 例题：[P9777 \[HUSTFC 2023\] Fujisaki 讨厌数学 - 洛谷](https://www.luogu.com.cn/problem/P9777)

代码

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<climits>
#include<algorithm>
#define ll long long
using namespace std;
ll m,n,k;
struct matrix{
	ll d[2][2];
	matrix(){
		memset(d,0,sizeof(d));
	}
	matrix operator*(const matrix& x){
		matrix ans;
		for(int i=0;i<=1;i++){
			for(int j=0;j<=1;j++){
				for(int k=0;k<=1;k++){
					ans.d[i][j]+=(d[i][k]*x.d[k][j])%m;
	            }
				ans.d[i][j]=((ans.d[i][j]%m)+m)%m;
			}
		}
		return ans;
	}
};
matrix fpow(matrix a,ll s){
	matrix ans;
	ans.d[0][0]=1;
	ans.d[1][1]=1;
	while(s){
		if(s&1) ans=ans*a;
		s>>=1;
		a=a*a;
	}
	return ans;
}
int main(){
	std::cin>>m>>k>>n;
	if(n==0){
		std::cout<<2;
		return 0;
	}
	if(n==1){
		std::cout<<k;
		return 0;
	}
	matrix a;
	a.d[0][0]=k;
	a.d[0][1]=1;
	a.d[1][0]=-1;
	a.d[1][1]=0;
	a=fpow(a,n-1);
	matrix c;
	c.d[0][0]=k;
	c.d[0][1]=2;
	c=c*a;
	std::cout<<c.d[0][0]%m;
	return 0;
}
```

> 特别注意，取模很容易出问题，比如如果考虑了n=2的情况，就需要在n=2的时候算出来的k*k-2先%m，后面代入矩阵乘法！！！

<img src="/images/image-20260309210016820.png" alt="image-20260309210016820" style="zoom:80%;" />

**记住记住！！！**

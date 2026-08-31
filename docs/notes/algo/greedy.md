# 贪心算法

## 核心思想

贪心算法顾名思义，就是以一种贪婪的方式去解决问题，能适用贪心算法的题目往往包含“最”这样的字眼，而解决他们的办法也很简单，核心就是排序，排序完就可以直接判断操作了，没必要想太多

## 例题一：活动安排问题

[E-考研_个人集训赛](https://ac.nowcoder.com/acm/contest/126768/E)

这题本质上就是活动安排类问题，为了使安排到的活动尽可能多。

开始被这玩意搞懵逼了qwq，当时想着要是两个活动重叠，那我就只能选一个，如果两个及以上的活动重合，那我如果选择这个活动，那后面两三个全部失效，那自然得跳过，所以单单写了个判断，发现答案错误。。。

其实这题很简单，不能以判断的思路去解题，而是该用贪心，尽量选取不会重合的两个活动，因为如果按照舍弃的思路的话，前面结束时间早的你把它舍弃掉了，那后面可安排的不是会更少吗！！所以按照结束时间早晚先排个序，然后去找有几个不会重合的累加，就可以啦。

给出代码：

（这里用到了c++11的pair，可以参考参考）

```cpp
#include<iostream>
#include<utility>
#include<vector>
#include<algorithm>
using namespace std;
bool cmp(pair<int,int>a,pair<int,int>b){
	return a.second<=b.second;
}
int main(){
	int n;
	std::cin>>n;
	vector<pair<int,int>>p;
	for(int i=0;i<n;i++) {
		int s,f;
		std::cin>>s>>f;
		p.push_back(make_pair(s,f));
	}
	sort(p.begin(),p.end(),cmp);
	vector<int>a(n+1);
	a[0]=1;
	int j=0,num=1;
	for(int i=1;i<n;i++){
		if(p[i].first>=p[j].second){
			a[i]=1;
			j=i;
			num++;
		}
		else a[i]=0;
	}
	std::cout<<num<<'\n';
	for(int i=0;i<n;i++){
		if(a[i]){
			std::cout<<p[i].first<<" "<<p[i].second<<'\n';
		}
	}
	return 0;
}
```

## 例题二：最优装载问题

有一批集装箱要装上一艘载重量为 c 的轮船。其中集装箱i的重量为wi 。最优装载问题要求确定在装载体积不受限制的情况下，将尽可能多的集装箱装上轮船。

这题偏简单，其实也就是从小到大排序嘛，然后一个个装，记录序号，然后就OK了。。。

可以学习学习pair之类的用法

```cpp
#include<bits/stdc++.h>
//#define int long long
using namespace std;
const int N = 1e5 + 10;
int n, c;
vector< pair<int, int> > p;

bool cmp(pair<int, int> a, pair<int, int>b)
{
    return a.second <= b.second;
}

void solve()
{
    int num = 0;        //装入的个数
    int tal = 0;         //装的重量总和
    vector<int> a;        //存一下装入的序号
    for(int i = 0; i < n; ++i)
    {
        tal += p[i].second;
        if(tal <= c) {
            num ++;
            a.emplace_back(p[i].first); //存序号
        }
        else {
            break;
        }
    }

    cout << "能装如最多货物的个数为：" << num << endl;
    cout << "以下是装的货物的编号：" << endl;
    for (auto ii : a) {
            cout << ii << " ";
    }
    cout << endl;
}

int main()
{
    cin >> c >> n;
    for(int i = 0; i < n; i++)
    {
        int x;
        cin >> x;
        p.push_back(make_pair(i + 1, x));   //first存序号second存重量
    }

    sort(p.begin(), p.end(), cmp); //按重量从轻到重排序

    solve();
    return 0;
}


```

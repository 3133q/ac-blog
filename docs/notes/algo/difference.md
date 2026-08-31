# 差分

可以理解为前缀和的逆运算，前缀和是累加，而差分是累减

## 一维差分

d[i]=a[i]-a[i-1]

C++ 标准库中实现了差分函数 [`std::adjacent_difference`](https://zh.cppreference.com/w/cpp/algorithm/adjacent_difference)，定义于头文件 `<numeric>` 中。

假设要将序列 {𝑎𝑖}![\{a_i\}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 在区间 [𝑙,𝑟]![[l,r]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 中的每个数都加上一个 𝑣![v](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)。可以在它的差分序列 {d𝑖}![\{D_i\}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 上做如下操作：

d[l]+=v       d[r+1]-=v

对于  1 3 2 4 5

进行差分    1 2 -1 2 1

然后前缀和  1 3 2 4 5    发现回到了最先开始的状态，即前缀和，差分互逆

应用：对一个区间进行加法/减法运算时，可以利用差分算法

eg.   对[l,r] 之间的每一个数加上c

实现  先化为差分数组，然后a[l]+=c，a[r+1]-=c

验证    1 3 2 4 5        对[2,4] 进行加2操作

差分    1 2 -1 2 1 0          ---->          1 4 -1 2 -1 0    （有时可以多加一项0，避免溢出）

前缀和   1 5 4 6 5        实现操作

## 二维差分

d[i] [j]=a[i] [j]-a[i-1] [j]-a[i] [j-1]+a[i-1] [j-1]

二维差分信息常用于维护二维数组的多次矩形加。例如，要对左上角为 (𝑥1,𝑦1)![(x_1,y_1)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)、右下角为 (𝑥2,𝑦2)![(x_2,y_2)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的矩阵中的每个数字都加上 𝑣![v](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，可以对它的差分数组 {𝐷𝑖,𝑗}![\{D_{i,j}\}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 做如下操作：

d[x1] [y1]+=v        d[x1] [y2+1]-=v          d[x2+1] [y1]-=v        d[x2+1] [y2+1] +=v

## 参考代码

```cpp
int n, m;
std::vector<std::vector<int>> diff, a;

// Add v to each element from [x1, y1] to [x2, y2].
void add(int x1, int y1, int x2, int y2, int v) {
  diff[x1][y1] += v;
  if (x2 < n) diff[x2 + 1][y1] -= v;
  if (y2 < m) diff[x1][y2 + 1] -= v;
  if (x2 < n && y2 < m) diff[x2 + 1][y2 + 1] += v;
}

// Execute this after all modifications and before all queries.
void prefix_sum() {
  a = diff;

  for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j) a[i][j] += a[i - 1][j];

  for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j) a[i][j] += a[i][j - 1];
}
```

## 例题

对于差分数组，存在有趣的性质，即差分数组（除第一项或越界的一项）以外，其他元素均为正数，则原数组递增，若都为负数，则原数组递减，若为0，则原数组都相等

因此，由于对原数组某区间进行加/减一个数时，差分操作是两个位置的数加和减这个数，但如果考虑两个特殊的位置，则还可以单独加或减一个数

得知，对于特殊的题型  由一个原始数组通过对某区间的值加或减，问经过几次得到目标数组，例如[3229. 使数组等于目标数组所需的最少操作次数 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-operations-to-make-array-equal-to-target/description/)

设 d 为 a 的差分数组，其中

d[i]={ 
a[i],
a[i]−a[i−1],


i=0
i≥1


由于全 0 数组的差分数组也全为 0，所以把 a 变成一个全为 0 的数组，等价于把 d 变成一个全为 0 的数组。

根据前置知识，「子数组内的每个元素的值增加或减少 1」这个操作等价于修改差分数组两个位置上的数，一个加一，另一个减一。特别地，如果修改的是 a 的后缀，那么操作等价于把差分数组中的一个数单独加一或者单独减一。

示例 1 的 a=[1,1,1,2]，差分数组 d=[1,0,0,1]，需要执行两次单独的减一操作。

示例 2 的 a=[1,−2,2]，差分数组 d=[1,−3,4]，这个要怎么操作？

贪心地想，由于每次操作可以执行一次加一和一次减一，那么选一个负数和一个正数操作是最优的。
执行 3 次操作后可以把 −3 变成 0，4 变成 1。此时 d=[1,0,1]，和示例 1 相同，执行两次单独的减一操作。
一共执行 3+2=5 次操作。

设正数之和绝对值为pos，负数之和绝对值neg，可以先执行min(pos,neg)次操作，让数组中只有正数或者负数，然后再执行|pos-neg|次操作，剩下的化为0

总的操作次数为

min(pos,neg)+∣pos−neg∣
上式可以继续简化：

如果 pos≥neg，那么上式为 neg+(pos−neg)=pos。
如果 pos<neg，那么上式为 pos+(neg−pos)=neg。
所以最终答案为    max(pos,neg)

### 代码

```cpp
class Solution {
public:
    long long minimumOperations(vector<int>& nums, vector<int>& target) {
        long long pos=0,neg=0;
        for(int i=0;i<nums.size();i++){
            int d=(target[i]-nums[i])-(i?(target[i-1]-nums[i-1]):0);
            if(d>0) pos+=d;
            else neg-=d;
        }
        return max(pos,neg);
    }
};
```

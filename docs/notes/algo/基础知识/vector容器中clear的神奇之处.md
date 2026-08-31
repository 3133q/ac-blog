关于vector容器中clear的神奇之处----

若单纯进行操作

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	int n=100;
	vector<int>a(n);
	//a.clear();
	a.push_back(-1);
	std::cout<<a[0];
	return 0;
}
```

输出结果为

![](/images/34.png)

但如果加上clear函数

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	int n=100;
	vector<int>a(n);
	a.clear();
	a.push_back(-1);
	std::cout<<a[0];
	return 0;
}
```

则输出结果为

![](/images/35.png)

可以知道，如果想用push_back去存数时，得先进行clear操作，这样才能使容器加进去的值不是在尾端（前面初始时全是0）


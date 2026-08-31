# 关于gcd和lcm函数

> 由于一般的c++都直到11，lcm函数它没有。。。

## gcd

对于这个函数，手写的话

```c++
int gcd(int a,int b){
    return b?a:gcd(b,a%b);
}
```

但我们不管是11还是17，都可以使用__gcd，记住是两根下划线！

## lcm

由于11的话，是用不了std::lcm的，但如果更高的版本，比如说17，可以导入一个&lt;numeric&gt;

然后直接std::lcm

不然的话，就手写吧

```c++
auto lcm=[&](int a,int b){
     return a/__gcd(a,b)*b;    //防溢出！
}
```


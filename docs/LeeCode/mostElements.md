---
id: mostElements
title: 多数元素
sidebar_label: 多数元素
---

> 给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

解题出现的问题： 认真审题！！！

## 方法1：排序
> 因为大于一半, 所以排序后的 中间那个数必是:

```javascript
/**
 * @param {number[]} nums
 * @return {number}
*/
var majorityElement = function (nums) {
  nums.sort((a, b) => a - b);
  return nums[Math.floor(nums.length / 2)];
}
```

时间复杂度 O(nlogn) 使用了快速排序

## 方法2：搞对象
用对象记录数出现的次数, 大于一半的就是了

```javascript
var majorityElement = function(nums) {
  let half = nums.length / 2
  let obj = {}
  for(let num of nums){
    obj[num] = (obj[num] || 0) + 1
    if(obj[num] > half) return num
  }
};
```

时间复杂度: O(n) 遍历一次
空间复杂度: O(n) obj中属性最多为 n/2 个

## 方法3：栈方法
当 元素和栈顶元素相等 或 空栈 时入栈

否则出栈
最后栈中剩下的必然都是是大于一半的那个元素

```javascript
var majorityElement = function(nums) {
  let stack = []
  for(let n of nums){
    let m = stack.length
    if(stack[m - 1] === n || !m){
      stack.push(n)
    } else {
      stack.pop()
    }
  }
  return stack[0]
};
```

时间 O(n) 循环一次nums
空间 O(n)

## 方法4： 抵消（栈方法降维）
相同的加1, 不相同的减1, 因为是大于一半, 所以最后肯定剩下大于一半的那个

```javascript
var majorityElement = function(nums) {
  let x = 0
  let m = 0
  for(let n of nums){
    if(m === 0){
      x = n
    }

    m += x === n ? 1 : -1;
  }
  return x
}
```

时间 O(n) 循环一次nums
空间 O(1) 使用几个基本变量

## 方法5：摩尔投票（分而治之）

> 众数（Mode）是一组数据中出现次数最多的数值，有时众数在一组数中有好几个。

摩尔投票，众数出现的次数为K，那其他字母出现的次数 &lt; k,那么遍历数组，如果 count==0 ，这个值暂时为众数，如果值与当前的众数不相等，则 count-=1 ，一直到最后，剩下的众数就是整个数组的众数。

```javascript
var majorityElement = function(nums) {
        let vote = 0;
    let res = nums[0];
    for(let i = 0; i < nums.length; i++){
        if(nums[i] == res){
            vote++;
        }else{
            vote--;
            if(vote == 0){
                res = nums[i];
                vote++;
            }
        }
    }
    return res;
};
```
#!/usr/bin/env python
# ‐*‐ coding:utf‐8 ‐*‐
"""code_info
@Time : 2020 2020/11/4 20:04
@Author : zqzess
@File : MainWork.py
"""
import os
import CMedia
import Microsoft
import Netflix
import YouTube
import GMedia
import Outside
import Mainland
import Apple
import check

print("去广告工作开始")
os.system('python ./ad.py')
print("去广告精简版工作开始")
os.system('python ./ad_lite.py')
print("CMedia工作开始")
CMedia.mainchange()
print("Microsoft工作开始")
Microsoft.change()
print("Netflix工作开始")
Netflix.change()
print("YouTube工作开始")
YouTube.change()
print("GMedia工作开始")
GMedia.mainchange()
print("Outside工作开始")
Outside.mainchange()
print("Mainland工作开始")
Mainland.mainchange()
print("Apple工作开始")
Apple.mainchange()
print("检查纠正工作开始")
check.mainCheck()
print("所有工作都完成")

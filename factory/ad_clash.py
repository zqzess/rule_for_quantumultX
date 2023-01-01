# -*- coding: utf-8 -*-
"""
@Time ： 2023/1/1 11:10
@Auth ： zqzess
@File ：ad_clash.py
@FileDesc ：
@IDE ：PyCharm
@Motto：So long as it is for my ideal,I wouldn't regret dying for it a thousand times.
"""
import os
import re
import sys


def ClashAdChange():
    if not os.path.exists('../Clash/filter'):
        os.makedirs('../Clash/filter')
    out_fname = '../Clash/filter/AdBlock.list'
    in_fname = '../Surge/List/AdBlock.list'

    if os.path.exists(out_fname):
        os.remove(out_fname)
        print("AdBlock.list文件存在，已执行删除")
    try:
        if sys.version_info.major == 3:
            f1 = open(in_fname, "r", encoding="utf-8")
            f2 = open(out_fname, "w+", encoding="utf-8")
        else:
            f1 = open(in_fname, "r")
            f2 = open(out_fname, "w+")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        lines = f1.readlines()
        lines[-1] = lines[-1].replace('\n', '') # 删除最后一行的换行符
        for lineTmp in lines:
            if re.search('# AdBlock rules refresh time', lineTmp):
                f2.write(lineTmp)
                f2.write('payload:\n')
            if re.search('#', lineTmp):
                continue
            if lineTmp == '':
                continue
            else:
                keywords = '  - ' + lineTmp
                f2.write(keywords)
        f1.close()
        f2.close()


if __name__ == '__main__':
    ClashAdChange()

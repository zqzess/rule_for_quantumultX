# -*- coding: utf-8 -*-
"""
@Time ： 2022/2/21 21:40
@Auth ： zqzess
@File ：check.py
@IDE ：PyCharm
@Motto：亦余心之所善兮,虽九死其犹未悔
"""
import sys
import re


def mainCheck():
    rules = ['HOST,spclient.wg.spotify.com,AdBlock']

    file_path = '../QuantumultX/rules/AdBlock.list'
    file_path2 = '../QuantumultX/rules/AdBlock_lite.list'
    try:
        if sys.version_info.major == 3:
            f1 = open(file_path, "r", encoding="utf-8")
            f2 = open(file_path2, "r", encoding="utf-8")
        else:
            f1 = open(file_path, "r")
            f2 = open(file_path2, "r")
    except:
        print("Error: 没有找到文件或读取文件失败")
    else:
        ruleList = []
        ruleListTmp = []
        ruleList2 = []
        ruleListTmp2 = []
        for lineTmp in f1:
            ruleListTmp.append(lineTmp)
        for lineTmp2 in f2:
            ruleListTmp2.append(lineTmp2)
        for rule in rules:
            ruleList = []
            for line in ruleListTmp:
                if re.search(rule, line) is not None:
                    print("\n--> AdBlock找到了: " + line)
                    pass
                else:
                    ruleList.append(line)
            ruleListTmp = ruleList
            ruleList2 = []
            for line in ruleListTmp2:
                if re.search(rule, line) is not None:
                    print("\n--> AdBlock_lite找到了: " + line)
                    pass
                else:
                    ruleList2.append(line)
            ruleListTmp2 = ruleList2
        f1.close()
        f2.close()
        try:
            if sys.version_info.major == 3:
                w1 = open(file_path, "w", encoding="utf-8")
                w2 = open(file_path2, "w", encoding="utf-8")
            else:
                w1 = open(file_path, "w")
                w2 = open(file_path2, "w")
        except:
            print("Error: 没有找到文件或读取文件失败")
        else:
            for i in ruleList:
                w1.write(i)
            w1.close()
            for i in ruleList2:
                w2.write(i)
            w1.close()


if __name__ == '__main__':
    mainCheck()

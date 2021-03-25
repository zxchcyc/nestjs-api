/*
 * @Author: archer zheng
 * @Date: 2020-07-29 16:06:44
 * @LastEditTime: 2020-12-18 10:33:28
 * @LastEditors: Please set LastEditors
 * @Description: SmoothWeightedRoundRobin 平滑轮询算法
 * @FilePath: /edc-api/src/internal/util/util-weighted-polling.service.ts
 */
import { Logger, Injectable } from '@nestjs/common';
import { NodeService } from './util-node.service';

interface ISelect {
  maxNode: NodeService;
  nodeList: NodeService[];
}

@Injectable()
export class SmoothWeightedRoundRobinService {
  private logger: Logger = new Logger(SmoothWeightedRoundRobinService.name);

  // 保存权重
  constructor(private nodeList: NodeService[]) {}

  // 拿到加权分配队列 这里为什么要加锁？并发会有问题,单线程不需要
  // https://github.com/rogierschouten/async-lock/blob/master/lib/index.js
  public async select(): Promise<ISelect> {
    try {
      // 加锁
      return this.selectInner();
    } finally {
      // 释放锁
    }
  }

  // 拿到加权分配队列
  private selectInner(): ISelect {
    let totalWeight: number = 0;
    let maxNode: NodeService = null;
    let maxWeight: number = 0;

    for (let node of this.nodeList) {
      totalWeight += node.getWeight();

      // 每个节点的当前权重要加上原始的权重
      node.setCurrentWeight(node.getCurrentWeight() + node.getWeight());

      // 保存当前权重最大的节点
      if (maxNode == null || maxWeight < node.getCurrentWeight()) {
        maxNode = node;
        maxWeight = node.getCurrentWeight();
      }
    }

    // 被选中的节点权重减掉总权重
    maxNode.setCurrentWeight(maxNode.getCurrentWeight() - totalWeight);

    return { maxNode, nodeList: this.nodeList };
  }
}

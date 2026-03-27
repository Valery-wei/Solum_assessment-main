import sys
sys.setrecursionlimit(1 << 25)
input = sys.stdin.readline

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        n, k = map(int, input().split())
        g = [[] for _ in range(n + 1)]

        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        parent = [0] * (n + 1)
        sub = [0] * (n + 1)
        order = []


        stack = [1]
        parent[1] = -1

        while stack:
            u = stack.pop()
            order.append(u)
            for v in g[u]:
                if v == parent[u]:
                    continue
                parent[v] = u
                stack.append(v)

        for u in reversed(order):
            sub[u] = 1
            for v in g[u]:
                if v == parent[u]:
                    continue
                sub[u] += sub[v]

        limit = n - k
        total = 0

        for u in range(1, n + 1):
            cnt = 1  

            for v in g[u]:
                if v == parent[u]:
                    continue
                if sub[v] <= limit:
                    cnt += sub[v]

            if parent[u] != -1:
                up_size = n - sub[u]
                if up_size <= limit:
                    cnt += up_size

            total += cnt

        ans.append(str(total))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
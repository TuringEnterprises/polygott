using System;
using System.Collections.Generic;
namespace Solution
{
  public class Solution
  {
    private int[] d = { 0, 1, 0, -1, 0 };
    char[][] g;
    public int NumIslands(char[][] grid)
    {
      int num = 0;
      g = grid;
      for (int i = 0; i < g.Length; i++)
      {
        for (int j = 0; j < g[i].Length; j++)
        {
          if (g[i][j] == '1')
          {
            DFSRecursive(i, j);
            num++;
          }
        }
      }
      return num;
    }
    public void DFSRecursive(int i, int j)
    {
      if (i < 0 || i >= g.Length || j >= g[i].Length || j < 0 || g[i][j] != '1')
        return;
      g[i][j] = '@';
      for (int k = 0; k < 4; k++)
        DFSRecursive(d[k] + i, d[k + 1] + j);
    }
  }
  public class Program
  {
    public static void Main(string[] args)
    {
      char[][] grid;
      int rows = int.Parse(Console.ReadLine());
      int cols = int.Parse(Console.ReadLine());
      grid = new char[rows][];
      for (int i = 0; i < rows; i++)
      {
        grid[i] = Console.ReadLine().ToCharArray();
      }
      int result = new Solution().NumIslands(grid);
      Console.Write(result);
    }
  }
}
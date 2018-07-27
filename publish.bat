# 发布脚本

# 移除现有文件目录
rm -r -v ../hexo-blog-web/blog

# 将当前生成的目录 移到目标目录
cp -r -v ./blog ../hexo-blog-web/blog/

# 删除demo包
rm -r -v ../blog/demo

# 移入demo包
cp -r -v ./demo ../blog/

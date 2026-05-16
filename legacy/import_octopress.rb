require 'fileutils'
src_path = File.expand_path('~/code/octopress/source/_posts')
Dir["#{src_path}/*"].map do |f|
  src = File.basename(f)
  next if src =~ /^_template/
  dst = File.expand_path("~/code/ddrscott.site/docs/blog/#{src.split('-')[0]}/#{src}")
  puts [f, dst].join("|")
  FileUtils.cp f, dst
end

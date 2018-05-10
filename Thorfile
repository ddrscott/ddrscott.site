require 'rubygems'
require 'thor'
require 'active_support/all'
require 'pp'
require 'pry'
require 'yaml'

class CLI < Thor
  desc 'deploy', 'deploy to ddrscott.github.io'
  def deploy
    site_path = ENV['SITE_PATH'] || '../ddrscott.github.io'
    system("mkdocs build --site-dir #{site_path}") || raise('Could not build site!')
    commit_msg = `git log --pretty=oneline --abbrev-commit -1 | head -1`.strip
    Dir.chdir(site_path) do
      system('git add .') || raise('Could not add files!')
      system(%(git commit -m "#{commit_msg}")) || raise('Could not commit files!')
      system('git push') || raise('Could not push changes!')
    end
  end

  desc 'pages', 'generate pages/blog section'
  def pages
    pattern = %r{(#\<pages>)(.*)(#\</pages>)}m
    # add 2 levels of nesting
    yml = {'pages' => {'blog' => blogs}}.to_yaml(UseHeader: false)
    # throw out header
    lines = yml.split("\n")[3..-1]
    updated = File.read('mkdocs.yml').sub(pattern, "\\1\n#{lines.join("\n")}\n  \\3")
    File.open('mkdocs.yml', 'w') {|io| io << updated}
  end

  private

  def blogs
    Dir.chdir('docs') do
      posts = Dir['blog/**/*.*'].map do |f|
        parts = File.basename(f).split('-')
        {
          year: parts[0],
          title: title(f),
          src: f
        }
      end

      posts_by_year = posts.group_by{|post| post[:year]}
      posts_by_year.keys.sort.reverse.each_with_object([]) do |year, agg|
        items = posts_by_year[year]
        agg << {year => items.map{|i| {i[:title] => i[:src]}}}
      end
    end
  end

  def title(f)
    IO.foreach(f) do |line|
      return $1.strip if line =~ /^#(.*)/
    end
    title_from_file(f)
  end

  def title_from_file(f)
    parts = File.basename(f).split('-')
    ext = File.extname(f)
    parts[3..-1].join(' ').sub(ext, '').titleize
  end
end
CLI.start

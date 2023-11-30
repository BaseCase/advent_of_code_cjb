puts "Starting part 2..."
input = File.read('./input.txt').split("\n").map { |line| line.split('') }

def locate_distance_1_strings(input)
  input.select do |line|
    input.select do |other_line|
      line.zip(other_line).reduce(0) do |acc, pair|
        if pair[0] != pair[1]
          acc + 1
        else
          acc
        end
      end == 1
    end.any?
  end
end

str1, str2 = locate_distance_1_strings(input)
answer = str1.zip(str2).select { |a, b| a == b }.map(&:first).join
puts answer

use std::ops::{ControlFlow, Range};

const INPUT: &str = include_str!("../../input");

#[derive(Debug)]
struct Part {
    ranges: Vec<(Range<u64>, Range<u64>)>,
}

impl Part {
    pub fn new() -> Self {
        Part { ranges: vec![] }
    }
}

impl From<&str> for Part {
    fn from(s: &str) -> Self {
        let mut result = Part::new();

        let ranges = s.lines().skip(1); // Skip name

        ranges
            .map(|line| {
                line.split(' ')
                    .map(|s| s.parse().unwrap())
                    .collect::<Vec<u64>>()
            })
            .for_each(|triple| match triple[..] {
                [dst, src, rng] => {
                    result.ranges.push((src..(src + rng), dst..(dst + rng)));
                }
                _ => unreachable!(),
            });

        result
    }
}

fn main() {
    let string_parts: Vec<&str> = INPUT.trim().split("\n\n").collect();

    let seeds: Vec<u64> = string_parts
        .first()
        .unwrap()
        .split(": ")
        .last()
        .unwrap()
        .split(' ')
        .map(|s| s.parse::<u64>().unwrap())
        .collect();

    let seed_ranges: Vec<Range<u64>> = seeds.chunks_exact(2).map(|a| a[0]..(a[0] + a[1])).collect();

    let parts: Vec<Part> = string_parts.iter().skip(1).map(|&p| p.into()).collect();

    let min_location: u64 = seed_ranges
        .iter()
        .map(|seed_range| {
            seed_range
                .clone()
                .map(|seed| process_seed(seed, &parts))
                .min()
                .unwrap()
        })
        .min()
        .unwrap();

    println!("{}", min_location)
}

fn process_seed(seed: u64, parts: &Vec<Part>) -> u64 {
    parts.iter().fold(seed, |acc, part| {
        match part.ranges.iter().try_fold(acc, |acc, range| {
            if range.0.contains(&acc) {
                ControlFlow::Break(range.1.start + (acc - range.0.start))
            } else {
                ControlFlow::Continue(acc)
            }
        }) {
            ControlFlow::Continue(acc) => acc,
            ControlFlow::Break(acc) => acc,
        }
    })
}

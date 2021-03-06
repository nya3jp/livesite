#!/usr/bin/python
#
# Copyright 2019 LiveSite authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import copy
import json
import os
import subprocess
import sys

import gflags

FLAGS = gflags.FLAGS

gflags.DEFINE_string('frozen_standings', None, '')
gflags.DEFINE_string('final_standings', None, '')
gflags.DEFINE_string('output_json', None, '')
gflags.MarkFlagAsRequired('frozen_standings')
gflags.MarkFlagAsRequired('final_standings')
gflags.MarkFlagAsRequired('output_json')


def rank_key(entry):
    times = list(reversed(sorted(p['penalty'] for p in entry['problems'] if p['solved'])))
    return tuple([-entry['solved'], entry['penalty']] + times)


def recompute_entries(entries):
    for entry in entries:
        entry['solved'] = len([p for p in entry['problems'] if p['solved']])
        entry['penalty'] = sum([
            p['penalty'] + 20 * (p['attempts'] - 1) for p in entry['problems']
            if p['solved']
        ])
    entries.sort(key=rank_key)
    rank = -1
    for i, entry in enumerate(entries):
        if i == 0 or rank_key(entry) != rank_key(entries[i - 1]):
            rank = i + 1
        entry['rank'] = rank


def check_entries_equals(entries1, entries2):
    if entries1 == entries2:
        return
    for i, (entry1, entry2) in enumerate(zip(entries1, entries2)):
        if entry1 != entry2:
            print 'ERROR: standings mismatch at rank %d' % (i + 1)
            print 'got:'
            print entry1
            print 'want:'
            print entry2


def main(unused_argv):
    with open(FLAGS.frozen_standings) as f:
        standings_start = json.load(f)
    with open(FLAGS.final_standings) as f:
        standings_end = json.load(f)

    assert len(standings_start['problems']) == len(standings_end['problems'])
    all_problems = standings_end['problems']

    entries_start = standings_start['entries']
    entries_end = standings_end['entries']

    assert len(entries_start) == len(entries_end)

    for entry in entries_start:
        entry['revealState'] = 'pending'
    for entry in entries_end:
        entry['revealState'] = 'finalized'

    for entry in entries_end:
        for problem in entry['problems']:
            assert problem['pendings'] == 0, 'Team %s has pending results in the end' % entry['teamId']

    final_map = {}
    for entry in entries_end:
        for i, problem in enumerate(entry['problems']):
            final_map[(entry['teamId'], i)] = problem

    for entry in entries_start:
        for i, problem_start in enumerate(entry['problems']):
            problem_end = final_map[(entry['teamId'], i)]
            assert problem_end['attempts'] <= problem_start['attempts'] + problem_start['pendings'], 'Team %s problem %d submissions increased' % (entry['teamId'], i)

    def reveal_step():
        for entry in reversed(entries):
            if entry['revealState'] == 'finalized':
                continue
            for i, problem in enumerate(entry['problems']):
                if problem['pendings'] > 0:
                    problem.clear()
                    problem.update(final_map[(entry['teamId'], i)])
                    return True
            entry['revealState'] = 'finalized'
            return True
        return False

    entries = copy.deepcopy(entries_start)
    recompute_entries(entries)
    check_entries_equals(entries, entries_start)

    entries_list = [copy.deepcopy(entries)]
    step = 0
    while reveal_step():
        recompute_entries(entries)
        entries_list.append(copy.deepcopy(entries))
        sys.stdout.write('.')
        sys.stdout.flush()
        step += 1
        if step >= 1000:
            assert False, entries
    sys.stdout.write('\n')
    sys.stdout.flush()

    check_entries_equals(entries, entries_end)

    data = {
        'entriesList': entries_list,
        'problems': all_problems,
    }

    with open(FLAGS.output_json, 'w') as f:
        json.dump(data, f, sort_keys=True, separators=(',', ':'))


if __name__ == '__main__':
    sys.exit(main(FLAGS(sys.argv)))

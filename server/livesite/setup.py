# -*- coding: utf-8 -*-

import os
import sys

import bottle
import gflags
from passlib.hash import sha256_crypt

from livesite import model

FLAGS = gflags.FLAGS


def setup_database():
  initialized = model.get_entity('initialized')['data']
  if initialized:
    return

  contest = {
      'title': u'ACM-ICPC 2016 国内予選',
      'detailedStandings': False,
      'problems': [],
      'times': {
          'start': 1451574000,   # 2016-01-01
          'end': 1483196400,     # 2017-01-01
          'freeze': 1483196400,  # 2017-01-01
      },
  }

  model.replace_entity('contest', contest)

  team_map = {}
  team_map['sample'] = {
      'id': 'sample',
      'name': 'Sample Team',
      'university': 'University of Sample',
      'photo': '/images/default-photo.png',
      'members': [{
          'name': 'Member %d' % (i + 1),
          'topcoderId': '',
          'codeforcesId': '',
          'twitterId': '',
          'githubId': '',
          'comment': '',
          'icon': '/images/default-icon.png',
      } for i in xrange(3)],
      'hidden': True,
  }
  model.replace_entity('teams', team_map)

  auth_map = {}
  fixed_hash = sha256_crypt.encrypt('hogehoge')
  auth_map['sample'] = fixed_hash

  model.replace_entity('auth', auth_map)

  standings = []
  model.replace_entity('standings', standings)

  model.replace_entity('initialized', True)


def setup():
  FLAGS(sys.argv)
  bottle.TEMPLATE_PATH = [os.path.join(os.path.dirname(__file__), 'templates')]
  bottle.BaseRequest.MEMFILE_MAX = 8 * 1024 * 1024
  setup_database()
